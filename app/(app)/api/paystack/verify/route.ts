import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { supabase } from "@/lib/supa-service";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");

  if (!reference) {
    return NextResponse.json(
      { error: "No reference provided" },
      { status: 400 },
    );
  }

  try {
    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      },
    );

    const { status, metadata, customer } = verifyRes.data.data;
    const clerk_user_id =
      metadata?.clerk_user_id || customer?.metadata?.clerk_user_id;

    if (status === "success" && clerk_user_id) {
      const plan = metadata?.plan || "pro";

      // Force update the DB in case the webhook is lagging
      await supabase
        .from("users")
        .update({ status: "active", plan: plan })
        .eq("clerk_user_id", clerk_user_id);

      return NextResponse.json({ data: verifyRes.data.data });
    }

    return NextResponse.json(
      { error: "Transaction not successful" },
      { status: 400 },
    );
  } catch (error: any) {
    console.error("Verification Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
