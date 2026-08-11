"use server";

import { mockAvatars } from "./data";
import path from "path";
import fs from "fs";

import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supa-service";

export async function setAvatarData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (process.env.NODE_ENV === "production") {
    throw new Error("Avatar seeding is disabled in production");
  }

  for (const data of mockAvatars) {
    const avatarPath = path.join(process.cwd(), "public", data.image_url);
    const avatarBuffer = fs.readFileSync(avatarPath);
    const { error: avatarError } = await supabase.storage
      .from("avatarStore")
      .upload(`exhibit/${data.name}.webp`, avatarBuffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (avatarError) throw new Error(avatarError.message);

    const { data: avatarUrl } = supabase.storage
      .from("avatarStore")
      .getPublicUrl(`exhibit/${data.name}.webp`);

    const { error: inserError } = await supabase.from("avatars").insert({
      name: data.name,
      image_url: avatarUrl.publicUrl,
    });
    if (inserError) throw new Error(inserError?.message);
  }
}
