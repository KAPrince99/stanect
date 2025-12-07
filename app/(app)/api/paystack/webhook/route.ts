// /app/api/paystack/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supa-service"; // service role key client

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";
  const secret = process.env.PAYSTACK_SECRET_KEY || "";

  // 1. Verify Signature
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

    // Logic for Subscription Activation
    if (["subscription.create", "subscription.activate"].includes(event)) {
      if (subscription_code) {
        // Update subscription record to active
        const { error: subErr } = await supabase
          .from("subscriptions")
          .update({
            status: "active",
            paystack_authorization_code: data.authorization?.authorization_code, // Save auth code if available
            paystack_customer_code: data.customer?.customer_code,
            updated_at: new Date().toISOString(),
          })
          .eq("paystack_subscription_code", subscription_code);

        if (subErr) console.error("Subscription update error:", subErr);
      }

      // Update user plan/status using clerk_user_id (if available in metadata)
      const userIdToUpdate =
        metadataClerkId ||
        (customer_email
          ? (
              await supabase
                .from("users")
                .select("clerk_user_id")
                .eq("email", customer_email)
                .single()
            )?.data?.clerk_user_id
          : null);

      if (userIdToUpdate && planName) {
        const { error: userErr } = await supabase
          .from("users")
          .update({ status: "active", plan: planName })
          .eq("clerk_user_id", userIdToUpdate);

        if (userErr) console.error("User update error:", userErr);
      }
    }

    // Logic for Subscription Cancellation/Disable
    if (["subscription.disable", "subscription.cancel"].includes(event)) {
      if (subscription_code) {
        await supabase
          .from("subscriptions")
          .update({ status: "cancelled", updated_at: new Date().toISOString() })
          .eq("paystack_subscription_code", subscription_code);
      }

      // Update user status
      if (customer_email) {
        // Find the user who owns this subscription and set their status to 'cancelled'
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
