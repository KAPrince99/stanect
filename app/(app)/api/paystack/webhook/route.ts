// /app/api/paystack/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supa-service"; // service role client

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";
  const secret = process.env.PAYSTACK_SECRET_KEY || ""; // 1. Verify Signature

  const computed = crypto
    .createHmac("sha512", secret)
    .update(bodyText)
    .digest("hex");
  if (computed !== signature) {
    console.warn("Paystack signature mismatch");
    return NextResponse.json({ status: "forbidden" }, { status: 403 });
  }

  let payload;
  try {
    payload = JSON.parse(bodyText);
  } catch (err) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const { event, data } = payload;
  console.log(`Received Paystack event: ${event}`);

  try {
    const subscription_code = data.subscription_code;
    const customer_email = data.customer?.email;
    const planName =
      data.plan?.name?.toLowerCase?.() || data.plan?.name || null;
    const metadataClerkId = data.metadata?.clerk_user_id;

    // --- LOGGING FOR DEBUGGING ---
    console.log(
      `Payload details - Sub Code: ${subscription_code}, Plan: ${planName}, Clerk ID (Metadata): ${metadataClerkId}`
    ); // 2. Logic for Successful Subscription / Charge Confirmation

    if (
      [
        "subscription.create",
        "subscription.activate",
        "charge.success",
      ].includes(event)
    ) {
      // 2a. Determine the Clerk User ID for the update
      let userIdToUpdate = metadataClerkId;

      // Fallback: If Clerk ID isn't in metadata, look up the user by email
      if (!userIdToUpdate && customer_email) {
        const { data: userData, error: fetchErr } = await supabase
          .from("users")
          .select("clerk_user_id")
          .eq("email", customer_email)
          .maybeSingle();

        if (fetchErr) {
          console.error("User fetch error by email:", fetchErr);
        } else if (userData) {
          userIdToUpdate = userData.clerk_user_id;
        }
      }

      // --- LOGGING FOR DEBUGGING ---
      console.log(`Final userIdToUpdate: ${userIdToUpdate}`);

      // 2b. Perform Updates only if a plan and user are found
      if (userIdToUpdate && planName) {
        // i. Update the main 'subscriptions' record
        if (subscription_code) {
          const { error: subErr } = await supabase
            .from("subscriptions")
            .update({
              status: "active",
              paystack_authorization_code:
                data.authorization?.authorization_code,
              paystack_customer_code: data.customer?.customer_code,
              updated_at: new Date().toISOString(),
            })
            .eq("paystack_subscription_code", subscription_code);

          if (subErr) console.error("Subscription update error:", subErr);
        }

        // ii. Update the main 'users' record (Status and Plan)
        const { error: userErr } = await supabase
          .from("users")
          .update({ status: "active", plan: planName })
          .eq("clerk_user_id", userIdToUpdate);

        if (userErr) console.error("User update error:", userErr);
      }
    } // 3. Logic for Subscription Cancellation/Disable

    if (
      [
        "subscription.disable",
        "subscription.cancel",
        "subscription.not_renewing",
      ].includes(event)
    ) {
      if (subscription_code) {
        // Update subscriptions table status
        await supabase
          .from("subscriptions")
          .update({ status: "cancelled", updated_at: new Date().toISOString() })
          .eq("paystack_subscription_code", subscription_code);
      } // Update user status by email

      if (customer_email) {
        await supabase
          .from("users")
          .update({ status: "cancelled" })
          .eq("email", customer_email);
      }
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
