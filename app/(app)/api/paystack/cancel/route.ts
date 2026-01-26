import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supa-service";

export async function POST() {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch user metadata to get codes
    const { data: dbUser } = await supabase
      .from("users")
      .select("metadata")
      .eq("clerk_user_id", user.id)
      .single();

    const subCode = dbUser?.metadata?.paystack_sub_code;

    // If a Paystack subscription exists, disable it
    if (subCode) {
      const paystackRes = await fetch(
        `https://api.paystack.co/subscription/disable`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: subCode,
            token: dbUser.metadata?.paystack_auth_code,
          }),
        },
      );

      const resData = await paystackRes.json();
      console.log("Paystack Cancellation:", resData.message);
    }

    //  Update database to Free plan and clear technical sub codes
    await supabase
      .from("users")
      .update({
        plan: "free",
        status: "active",
        updated_at: new Date().toISOString(),
        metadata: {
          ...dbUser?.metadata,
          paystack_sub_code: null,
          cancelled_at: new Date().toISOString(),
        },
      })
      .eq("clerk_user_id", user.id);

    return NextResponse.json({ message: "Successfully downgraded to free" });
  } catch (err) {
    console.error("Cancellation Route Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
