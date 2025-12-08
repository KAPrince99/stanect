// /app/payment/callback/route.ts (or use a Page/Server Component)
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { redirect } from "next/navigation";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");

  // Paystack returns 'trxref' and 'reference' query parameters
  if (!reference) {
    // If no reference, redirect to dashboard or error page
    redirect("/dashboard?status=failure&message=No_payment_reference");
  }

  try {
    // STEP 1: Verify the transaction with Paystack
    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = verifyRes.data.data;

    if (data.status === "success") {
      // SUCCESS! The webhook should have updated the DB, but we redirect now.

      // Optional: You can check if the webhook has already run here,
      // but for simplicity, we rely on the webhook to handle DB updates.

      // STEP 2: Redirect user to the dashboard with a success message
      redirect("/dashboard?status=success&message=Payment_verified");
    } else {
      // Payment failed or was not completed
      redirect("/pricing?status=failure&message=Payment_not_successful");
    }
  } catch (error: any) {
    console.error("Paystack Verification Error:", error.message);
    // Redirect to a dashboard or error page on verification failure
    redirect("/dashboard?status=failure&message=Verification_failed");
  }
}
