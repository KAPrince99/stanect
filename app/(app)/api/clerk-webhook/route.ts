import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { supabase } from "@/lib/supa-service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  // 1. Verify Headers
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Error: Missing Svix headers");
    return new Response("Missing svix headers", { status: 400 });
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Error: CLERK_WEBHOOK_SECRET is not defined in .env");
    return new Response("Webhook secret missing", { status: 500 });
  }

  const wh = new Webhook(webhookSecret);
  let evt: any;

  // 2. Verify Payload Signature
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error: Could not verify webhook signature", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const clerkId = evt.data.id;
  const eventType = evt.type;

  console.log(`Processing Clerk Webhook: ${eventType} for User: ${clerkId}`);

  try {
    // 3. Handle Create or Update
    if (eventType === "user.created" || eventType === "user.updated") {
      const email = evt.data.email_addresses?.[0]?.email_address || null;
      const firstName = evt.data.first_name || "";
      const lastName = evt.data.last_name || "";
      const name = `${firstName} ${lastName}`.trim() || null;

      console.log("Attempting Supabase Upsert...", {
        clerk_user_id: clerkId,
        email,
      });

      const { data, error } = await supabase
        .from("users")
        .upsert(
          {
            clerk_user_id: clerkId,
            email: email,
            name: name,
          },
          { onConflict: "clerk_user_id" }
        )
        .select(); // Select ensures we see the result of the operation

      if (error) {
        console.error("Supabase Upsert Error:", error.message, error.details);
        throw error;
      }

      console.log("Supabase Sync Success:", data);
    }

    // 4. Handle Delete
    if (eventType === "user.deleted") {
      console.log("Attempting Supabase Delete...");

      const { error: sessionsError } = await supabase
        .from("sessions")
        .delete()
        .eq("owner_id", clerkId);

      if (sessionsError) {
        console.error("Supabase sessions delete error:", sessionsError.message);
      }

      const { error } = await supabase
        .from("users")
        .delete()
        .eq("clerk_user_id", clerkId);

      if (error) {
        console.error("Supabase Delete Error:", error.message);
        throw error;
      }
      console.log("Supabase Delete Success");
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook Handler Final Crash:", err.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
