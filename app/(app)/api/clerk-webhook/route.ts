import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";

// 1. Force this route to be dynamic so Next.js doesn't try to "build" it
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // 2. Move initialization INSIDE the POST handler
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase environment variables are missing!");
    return new Response("Server configuration error", { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const body = await req.text();
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Webhook secret missing", { status: 500 });
  }

  const wh = new Webhook(webhookSecret);
  let evt: any;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }

  const clerkId = evt.data.id;
  const eventType = evt.type;

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const email = evt.data.email_addresses?.[0]?.email_address || null;
      const firstName = evt.data.first_name || "";
      const lastName = evt.data.last_name || "";
      const name = `${firstName} ${lastName}`.trim() || null;

      const { error } = await supabase
        .from("users")
        .upsert(
          { clerk_user_id: clerkId, email, name },
          { onConflict: "clerk_user_id" }
        );

      if (error) throw error;
    }

    if (eventType === "user.deleted") {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("clerk_user_id", clerkId);

      if (error) throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
