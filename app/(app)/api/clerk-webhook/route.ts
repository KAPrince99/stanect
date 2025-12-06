import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  // 1. Get the raw body as text for Svix verification
  const body = await req.text();
  const payload = JSON.parse(body);

  // 2. Access headers correctly using `req.headers.get()`
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  // Check for missing required headers and secret
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers");
    return new Response("Missing svix headers", { status: 400 });
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Webhook secret missing");
    return new Response("Webhook secret missing", { status: 400 });
  }

  const wh = new Webhook(webhookSecret);
  let evt: any;

  try {
    // 3. Verify using the raw body string and extracted headers
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // Rest of your logic remains the same...
  const { id } = evt.data;
  const eventType = evt.type;

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const { email_addresses, first_name, last_name } = evt.data;
      const userEmail = email_addresses?.[0]?.email_address || null;
      const userName = `${first_name || ""} ${last_name || ""}`.trim();

      console.log("Preparing to upsert user:", {
        clerk_user_id: id,
        email: userEmail,
        name: userName,
      });

      const userToUpsert = {
        clerk_user_id: id,
        email: userEmail,
        name: userName,
        plan: "free",
        status: "active",
      };

      const { error } = await supabase
        .from("users")
        .upsert([userToUpsert], { onConflict: "clerk_user_id" });

      if (error) {
        console.error("Supabase upsert error:", error);
        throw new Error(error.message);
      }
      console.log(`User ${id} upserted successfully.`);
    }

    if (eventType === "user.deleted") {
      console.log(`Preparing to delete user with clerk_user_id: ${id}`);
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("clerk_user_id", id);

      if (error) {
        console.error("Supabase delete error:", error);
        throw new Error(error.message);
      }
      console.log(`User ${id} deleted successfully.`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
