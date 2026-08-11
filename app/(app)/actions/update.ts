"use server";

import { supabase } from "@/lib/supa-service";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { updateProfileSchema } from "@/schemas/updateProfileSchema";

export async function updateProfile(
  formData: FormData,
  currentProfilePicture?: string,
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    country: formData.get("country") || "Earth",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid profile data");
  }

  const { name, country } = parsed.data;
  const image = formData.get("image");
  const imageFile = image instanceof File && image.size > 0 ? image : null;

  let profilePictureUrl: string | null = currentProfilePicture || null;

  if (imageFile && currentProfilePicture) {
    try {
      const urlParts = currentProfilePicture.split(
        "/storage/v1/object/public/profiles/",
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

  if (imageFile) {
    const fileExt = imageFile.name.split(".").pop();
    const newFileName = `${userId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(newFileName, imageFile, {
        upsert: true,
        contentType: imageFile.type,
      });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data: publicUrlData } = supabase.storage
      .from("profiles")
      .getPublicUrl(newFileName);

    profilePictureUrl = publicUrlData.publicUrl;
  }

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
