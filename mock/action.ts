"use server";

import { mockAvatars } from "./data";
import path from "path";
import fs from "fs";

import { supabase } from "@/lib/supa-service";

export async function setAvatarData() {
  for (const data of mockAvatars) {
    // Read image files from public directory
    const avatarPath = path.join(process.cwd(), "public", data.image_url);
    const avatarBuffer = fs.readFileSync(avatarPath);
    // Upload avatar image to Storage
    const { error: avatarError } = await supabase.storage
      .from("avatarStore")
      .upload(`exhibit/${data.name}.webp`, avatarBuffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (avatarError) throw new Error(avatarError.message);
    // Get public URL
    const { data: avatarUrl } = supabase.storage
      .from("avatarStore")
      .getPublicUrl(`exhibit/${data.name}.webp`);

    // Insert record into "avatars" table
    const { error: inserError } = await supabase.from("avatars").insert({
      name: data.name,
      image_url: avatarUrl.publicUrl,
    });
    if (inserError) throw new Error(inserError?.message);
  }
  console.log("✅ All images uploaded and records created successfully!");
}
