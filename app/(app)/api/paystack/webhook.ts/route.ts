"use server";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supa-service";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature")!;
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ status: "forbidden" }, { status: 403 });
  }

  const payload = JSON.parse(body);
  const { event, data } = payload;

  try {
    // Activate subscription
    if (["subscription.create", "subscription.activate"].includes(event)) {
      await supabase
        .from("subscriptions")
        .update({
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("paystack_subscription_code", data.subscription_code);

      await supabase
        .from("users")
        .update({
          status: "active",
          plan: data.plan.name.toLowerCase(),
        })
        .eq("email", data.customer.email);
    }

    // Cancel subscription
    if (["subscription.disable", "subscription.cancel"].includes(event)) {
      await supabase
        .from("subscriptions")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("paystack_subscription_code", data.subscription_code);

      await supabase
        .from("users")
        .update({
          status: "cancelled",
        })
        .eq("email", data.customer.email);
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
