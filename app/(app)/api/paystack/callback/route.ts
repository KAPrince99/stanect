import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!reference) {
    return NextResponse.redirect(`${baseUrl}/pricing?status=error`);
  }

  try {
    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      },
    );

    const { status } = verifyRes.data.data;

    if (status === "success") {
      return NextResponse.redirect(`${baseUrl}/pricing/success`);
    } else {
      return NextResponse.redirect(`${baseUrl}/pricing?status=failed`);
    }
  } catch (error) {
    console.error("Callback Verification Error:", error);
    return NextResponse.redirect(`${baseUrl}/pricing?status=error`);
  }
}
