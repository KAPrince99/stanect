import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supa-service";
import axios from "axios";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

const PLAN_CODES: Record<string, { monthly: string; yearly: string }> = {
  pro: {
    monthly: process.env.PLAN_PRO_MONTHLY!,
    yearly: process.env.PLAN_PRO_YEARLY!,
  },
  king: {
    monthly: process.env.PLAN_KING_MONTHLY!,
    yearly: process.env.PLAN_KING_YEARLY!,
  },
};

export async function POST(req: NextRequest) {
  try {
    const { userId: clerk_user_id } = await auth();
    if (!clerk_user_id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { plan, interval } = await req.json();
    const planCode = PLAN_CODES[plan]?.[interval];

    if (!planCode)
      return NextResponse.json(
        { error: "Plan configuration missing" },
        { status: 400 },
      );

    const { data: userRow } = await supabase
      .from("users")
      .select("email")
      .eq("clerk_user_id", clerk_user_id)
      .single();
    if (!userRow?.email)
      return NextResponse.json(
        { error: "User email missing" },
        { status: 404 },
      );

    await supabase
      .from("users")
      .update({ status: "pending" })
      .eq("clerk_user_id", clerk_user_id);

    // Amounts in GHS (Must match your Paystack Dashboard EXACTLY)
    let price = 0;
    if (plan === "pro") {
      price = interval === "monthly" ? 135 : 1396;
    } else if (plan === "king") {
      price = interval === "monthly" ? 591 : 5596;
    }

    // Convert to Pesewas
    const amountInPesewas = Math.round(price * 100);

    const initRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: userRow.email,
        amount: amountInPesewas,
        plan: planCode,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/callback`,
        metadata: {
          clerk_user_id: clerk_user_id,
          plan: plan,
          interval: interval,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return NextResponse.json(initRes.data.data);
  } catch (err: any) {
    console.error("❌ PAYSTACK ERROR:", err.response?.data || err.message);
    const { userId } = await auth();
    if (userId)
      await supabase
        .from("users")
        .update({ status: "active" })
        .eq("clerk_user_id", userId);
    return NextResponse.json({ error: "Connection failed" }, { status: 500 });
  }
}
