"use server";

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supa-service";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { plan, interval } = await req.json();
    const { userId: clerk_user_id } = await auth();

    if (!clerk_user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // PLAN CODE MAPPING
    const planMapping: Record<string, Record<string, string>> = {
      pro: {
        monthly: process.env.PLAN_PRO_MONTHLY!,
        yearly: process.env.PLAN_PRO_YEARLY!,
      },
      king: {
        monthly: process.env.PLAN_KING_MONTHLY!,
        yearly: process.env.PLAN_KING_YEARLY!,
      },
    };

    const planCode = planMapping[plan]?.[interval];
    if (!planCode) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // GET USER EMAIL
    const { data: userData, error: userErr } = await supabase
      .from("users")
      .select("email")
      .eq("clerk_user_id", clerk_user_id)
      .single();

    if (userErr || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const email = userData.email;

    // ---------- 1. CREATE PAYSTACK SUBSCRIPTION ----------
    const response = await fetch("https://api.paystack.co/subscription", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: email,
        plan: planCode,
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    const subscription = data.data;

    // ---------- 2. SAVE TO SUBSCRIPTIONS TABLE ----------
    await supabase.from("subscriptions").insert({
      clerk_user_id,
      plan,
      interval,
      status: "pending",
      paystack_subscription_code: subscription.subscription_code,
      paystack_customer_code: subscription.customer?.customer_code,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // ---------- 3. UPDATE USER TABLE ----------
    await supabase
      .from("users")
      .update({
        plan,
        status: "pending",
      })
      .eq("clerk_user_id", clerk_user_id);

    return NextResponse.json({
      authorization_url: subscription.authorization_url,
    });
  } catch (error) {
    console.error("PAYSTACK ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
