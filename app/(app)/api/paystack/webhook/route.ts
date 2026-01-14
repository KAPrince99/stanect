import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supa-service";

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";
  const secret = process.env.PAYSTACK_SECRET_KEY || "";

  const key = process.env.SUPABASE_SECRET_KEY;

  // ADD THIS LINE HERE:
  console.log("--- Supabase Key Debug ---");
  console.log("Key Found:", !!key);
  if (key) {
    console.log(
      "Key Type Check:",
      key.startsWith("sb_") ? "Opaque (New 2026 Format)" : "JWT (Legacy Format)"
    );
    console.log("Key Length:", key.length);
  }
  console.log("--------------------------");

  // 1. Verify Paystack Signature
  const computed = crypto
    .createHmac("sha512", secret)
    .update(bodyText)
    .digest("hex");

  if (computed !== signature) {
    console.warn("Paystack signature mismatch");
    return NextResponse.json({ status: "forbidden" }, { status: 403 });
  }

  // 2. Defensive check for Supabase Client Initialization
  // This prevents the "No suitable key" error from crashing the route blindly
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasKey = !!process.env.SUPABASE_SECRET_KEY;

  if (!hasUrl || !hasKey) {
    console.error(
      "WEBHOOK ERROR: Supabase environment variables are missing in production!"
    );
    console.log(`Debug - URL exists: ${hasUrl}, Secret Key exists: ${hasKey}`);
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
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

    console.log(
      `Payload details - Sub Code: ${subscription_code}, Plan: ${planName}, Clerk ID: ${metadataClerkId}`
    );

    // --- LOGIC FOR SUCCESSFUL CHARGE / SUBSCRIPTION ---
    if (
      [
        "subscription.create",
        "subscription.activate",
        "charge.success",
      ].includes(event)
    ) {
      let userIdToUpdate = metadataClerkId;

      // Fallback: Lookup user by email if Clerk ID is missing from metadata
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

      console.log(`Final userIdToUpdate: ${userIdToUpdate}`);

      if (userIdToUpdate && planName) {
        // i. Update Subscriptions Table
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

        // ii. Update Users Table
        const { error: userErr } = await supabase
          .from("users")
          .update({ status: "active", plan: planName })
          .eq("clerk_user_id", userIdToUpdate);

        if (userErr) console.error("User update error:", userErr);
      }
    }

    // --- LOGIC FOR CANCELLATION ---
    if (
      [
        "subscription.disable",
        "subscription.cancel",
        "subscription.not_renewing",
      ].includes(event)
    ) {
      if (subscription_code) {
        await supabase
          .from("subscriptions")
          .update({ status: "cancelled", updated_at: new Date().toISOString() })
          .eq("paystack_subscription_code", subscription_code);
      }

      if (customer_email) {
        await supabase
          .from("users")
          .update({ status: "cancelled" })
          .eq("email", customer_email);
      }
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook handler internal error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
