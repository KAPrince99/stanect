// /app/api/paystack/subscribe/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supa-service";
import axios from "axios";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

// Map your internal plan keys to Paystack plan codes (from your dashboard)
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

// Helper function to find or create a Paystack customer
async function getOrCreateCustomer(email: string, name?: string) {
  try {
    // 1) Try to find existing customer by email
    const listRes = await axios.get(
      `https://api.paystack.co/customer?email=${encodeURIComponent(email)}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
    );

    if (listRes.data.status && listRes.data.data.length > 0) {
      return listRes.data.data[0]; // Existing customer
    }

    // 2) Create new customer
    const createRes = await axios.post(
      "https://api.paystack.co/customer",
      {
        email,
        first_name: name ? name.split(" ")[0] : undefined,
        last_name: name ? name.split(" ").slice(1).join(" ") : undefined,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return createRes.data.data;
  } catch (error: any) {
    console.error(
      "Paystack Customer Error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to find or create customer"
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId: clerk_user_id } = auth();
    if (!clerk_user_id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { plan, interval } = body as {
      plan?: string;
      interval?: "monthly" | "yearly";
    };

    if (!plan || !["monthly", "yearly"].includes(interval || "")) {
      return NextResponse.json(
        { error: "Invalid plan or interval" },
        { status: 400 }
      );
    }

    const planCode = PLAN_CODES[plan!]?.[interval!];
    if (!planCode)
      return NextResponse.json(
        { error: "Plan code missing for this plan/interval" },
        { status: 400 }
      );

    // Fetch user record from Supabase
    const { data: userRow, error: userErr } = await supabase
      .from("users")
      .select("email, name")
      .eq("clerk_user_id", clerk_user_id)
      .single();

    if (userErr || !userRow?.email) {
      return NextResponse.json(
        { error: "User not found or email missing" },
        { status: 404 }
      );
    }

    const email = userRow.email as string;
    const name = (userRow.name as string) || undefined;

    // STEP 1: Ensure Paystack customer exists
    const customer = await getOrCreateCustomer(email, name);
    const customerCode = customer.customer_code;

    let subscription_code: string | undefined;
    let authorization_url: string | undefined;

    // TRY 1: Direct Subscription Creation
    try {
      const subRes = await axios.post(
        "https://api.paystack.co/subscription",
        { customer: customerCode, plan: planCode },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const subscription = subRes.data.data;
      subscription_code = subscription.subscription_code;
      authorization_url = subscription.authorization_url; // Null if instantly charged

      // If successful, insert the PENDING subscription record now
      await supabase.from("subscriptions").insert({
        clerk_user_id,
        plan,
        interval,
        paystack_subscription_code: subscription_code,
        paystack_customer_code: customerCode,
        metadata: { clerk_user_id, plan, interval },
        status: "pending", // Will be 'active' instantly if no redirect
      });
    } catch (subError: any) {
      // Check if the error is specifically 'no_active_authorizations_for_customer'
      if (
        subError.response?.data?.code ===
        "no_active_authorizations_for_customer"
      ) {
        console.warn(
          "Paystack: Customer needs authorization. Initiating transaction..."
        );

        // --- FALLBACK: INITIATE TRANSACTION FOR FIRST CHARGE ---

        // You should determine the actual first charge amount (e.g., from a plan config)
        // For demonstration, assuming 10000 kobo/pesewas (100.00 currency unit)
        const amount = 10000;

        const initRes = await axios.post(
          "https://api.paystack.co/transaction/initialize",
          {
            email,
            amount: amount,
            plan: planCode, // Pass plan code to create the subscription after success
            callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
            metadata: {
              custom_fields: [
                {
                  display_name: "Clerk ID",
                  variable_name: "clerk_id",
                  value: clerk_user_id,
                },
                {
                  display_name: "Plan Key",
                  variable_name: "plan_key",
                  value: plan,
                },
                {
                  display_name: "Interval",
                  variable_name: "interval",
                  value: interval,
                },
              ],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        authorization_url = initRes.data.data.authorization_url;

        // Note: We skip the DB insert here and rely on the webhook/callback
        // to handle the subscription record creation upon successful transaction.
      } else {
        // Re-throw any other unexpected Paystack error
        throw subError;
      }
    }

    // STEP 2: Update user status to pending (if we got a redirect URL)
    // We update status to PENDING if a redirect is required, or if the direct sub was successful.
    if (authorization_url || subscription_code) {
      await supabase
        .from("users")
        .update({ plan, status: "pending" })
        .eq("clerk_user_id", clerk_user_id);
    }

    // STEP 3: Return redirect URL or success message
    if (authorization_url) {
      // This is the response for redirecting to Paystack
      return NextResponse.json({ authorization_url, subscription_code });
    }

    // This is the response for an instant, successful subscription
    return NextResponse.json({
      subscription_code,
      message: "Subscription activated instantly.",
    });
  } catch (err: any) {
    // Log the detailed error from Paystack for debugging
    const paystackError = err.response?.data;
    console.error("Subscribe route error:", paystackError || err.message);

    return NextResponse.json(
      {
        error: paystackError?.message || err.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
