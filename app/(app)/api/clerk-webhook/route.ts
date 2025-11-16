import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const payload = await req.json();
  const headers = Object.fromEntries(req.headers);
  const svix_id = headers["svix-id"] as string;
  const svix_timestamp = headers["svix-timestamp"] as string;
  const svix_signature = headers["svix-signature"] as string;

  // Checking if the webhook secret exists
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Webhook secret not found.", { status: 400 });
  }

  // Verify the webhook signature
  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return new Response("Error occurred.", { status: 400 });
  }

  // Handle the user.created event
  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    // Insert the new user into Supabase
    const { data, error } = await supabase.from("users").insert([
      {
        clerk_user_id: id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
      },
    ]);

    if (error) {
      console.error("Error inserting user into Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

type WebhookEvent = {
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string;
    last_name: string;
  };
  type: "user.created";
  object: "event";
};
