import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supa-service";

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";

  // Verify Signature
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(bodyText)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ status: "forbidden" }, { status: 403 });
  }

  const payload = JSON.parse(bodyText);
  const { event, data } = payload;

  const clerk_user_id =
    data.metadata?.clerk_user_id || data.customer?.metadata?.clerk_user_id;
  const response = NextResponse.json({ status: "accepted" }, { status: 200 });

  if (!clerk_user_id) return response;

  try {
    // EVENT: Successful Payment (Initial or Renewal)
    if (event === "charge.success") {
      const plan = data.metadata?.plan || "pro";

      const subMetadata = {
        interval: data.metadata?.interval || "monthly",
        paystack_customer_code: data.customer?.customer_code,

        paystack_sub_code: data.subscription_code ?? null,
        paystack_auth_code: data.authorization?.authorization_code,
        last_payment: data.paid_at,
      };

      await supabase
        .from("users")
        .update({
          plan: plan,
          status: "active",
          metadata: subMetadata,
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", clerk_user_id);
    }

    // EVENT: Subscription Cancelled or Disabled
    if (event === "subscription.disable") {
      await supabase
        .from("users")
        .update({
          plan: "free",
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", clerk_user_id);
    }

    return response;
  } catch (error) {
    console.error("Webhook Logic Error:", error);
    return response;
  }
}
