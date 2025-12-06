import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";

// Use service role key (server only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  // IMPORTANT: body must be read as raw text for Svix verification
  const body = await req.text();

  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers");
    return new Response("Missing svix headers", { status: 400 });
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
  const wh = new Webhook(webhookSecret);

  let evt: any;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Clerk webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const clerkId = evt.data.id;
  const eventType = evt.type;

  console.log("➡️ Incoming webhook:", eventType, "for user", clerkId);

  try {
    // CREATE / UPDATE USER
    if (eventType === "user.created" || eventType === "user.updated") {
      const email = evt.data.email_addresses?.[0]?.email_address || null;

      const firstName = evt.data.first_name || "";
      const lastName = evt.data.last_name || "";
      const name = `${firstName} ${lastName}`.trim() || null;

      const userRecord = {
        clerk_user_id: clerkId,
        email,
        name,
        // Defaults match your schema: plan = 'free', status = 'active'
      };

      const { error } = await supabase
        .from("users")
        .upsert([userRecord], { onConflict: "clerk_user_id" });

      if (error) {
        console.error("❌ Supabase upsert error:", error);
        throw error;
      }

      console.log("✅ User synced with Supabase:", clerkId);
    }

    // DELETE USER
    if (eventType === "user.deleted") {
      console.log("🗑️ Deleting user from Supabase:", clerkId);

      const { error } = await supabase
        .from("users")
        .delete()
        .eq("clerk_user_id", clerkId);

      if (error) {
        console.error("❌ Supabase delete error:", error);
        throw error;
      }

      console.log("✅ User deleted from Supabase:", clerkId);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Clerk webhook processing error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
