"use server";
import { buildAssistant } from "@/lib/buildAssistant";
import { createSupabaseClient } from "@/lib/supabase";
import { AvatarProps, CreateCompanionProps } from "@/types/types";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function getAvatars(): Promise<AvatarProps[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("avatars").select("*");
  if (!data || error) if (error) throw new Error("Error fetching avatars");
  return (data ?? []) as AvatarProps[];
}

export async function getSingleCompanion(id: string) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("companions")
    .select("*, avatars:avatar_id (image_url)")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getCompanions(id: string) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .select("*, avatars:avatar_id (image_url)")
    .eq("owner_id", id);

  if (error) throw new Error(error.message);

  return data ?? [];
}
export async function createCompanion(formData: CreateCompanionProps) {
  const { userId } = await auth();
  const user = await currentUser();
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("companions")
    .insert({ ...formData, owner_id: userId, username: user?.firstName })
    .select();

  if (error || !data)
    throw new Error(error?.message || "Failed to create a companion");
  console.log("DATA HERE:", data);

  const companion = data[0];

  const assistantConfig = buildAssistant(companion);
  console.log("ASSISTANT CONFIG:", assistantConfig);

  const vapiRes = await fetch("https://api.vapi.ai/assistant", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assistantConfig),
  });

  const vapiData = await vapiRes.json();
  console.log("VAPI RESPONSE:", vapiData);

  await supabase
    .from("companions")
    .update({ assistant_id: vapiData.id })
    .eq("id", companion.id);

  return {
    success: true,
    message: "Companion created successfully 🎉",
    data: companion,
    vapi: vapiData,
  };
}

export async function deleteCompanion(id: string) {
  const supbase = createSupabaseClient();
  const { error } = await supbase.from("companions").delete().eq("id", id);
  if (error) throw new Error("Failed to delete companion");
  return {
    success: true,
    message: "Companion deleted successfully🎉",
  };
}
