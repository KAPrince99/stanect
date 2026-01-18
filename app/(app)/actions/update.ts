"use server";

import { supabase } from "@/lib/supa-service";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(
  formData: FormData,
  currentProfilePicture?: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const country = formData.get("country") as string;
  const image = formData.get("image") as File | null;

  let profilePictureUrl: string | null = currentProfilePicture || null;

  // If a new image is provided, delete the old one first
  if (image && image.size > 0 && currentProfilePicture) {
    try {
      // Extract the path from the full public URL
      // Logic: https://.../storage/v1/object/public/profiles/FOLDER/FILE.png -> FOLDER/FILE.png
      const urlParts = currentProfilePicture.split(
        "/storage/v1/object/public/profiles/"
      );
      const oldFilePath = urlParts[1];

      if (oldFilePath) {
        const { error: deleteError } = await supabase.storage
          .from("profiles")
          .remove([oldFilePath]);

        if (deleteError)
          console.warn("Old file delete warning:", deleteError.message);
      }
    } catch (err) {
      console.error("Delete operation failed:", err);
    }
  }

  // Upload the new image
  if (image && image.size > 0) {
    const fileExt = image.name.split(".").pop();
    // Unique name using timestamp ensures CDN cache-busting
    const newFileName = `${userId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(newFileName, image, {
        upsert: true,
        contentType: image.type,
      });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data: publicUrlData } = supabase.storage
      .from("profiles")
      .getPublicUrl(newFileName);

    profilePictureUrl = publicUrlData.publicUrl;
  }

  // Update the database
  const { error: updateError } = await supabase
    .from("users")
    .update({
      name,
      country,
      profile_picture: profilePictureUrl,
    })
    .eq("clerk_user_id", userId);

  if (updateError) throw new Error(`DB update failed: ${updateError.message}`);

  revalidatePath("/profile");
  return { success: true, profilePictureUrl };
}
