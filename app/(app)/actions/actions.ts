"use server";
import { createSupabaseClient } from "@/lib/supabase";
import { AvatarProps, CreateCompanionProps } from "@/types/types";
import { auth } from "@clerk/nextjs/server";

export async function getAvatars(): Promise<AvatarProps[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("avatars").select("*");
  if (!data || error) if (error) throw new Error("Error fetching avatars");
  return (data ?? []) as AvatarProps[];
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
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("companions")
    .insert({ ...formData, owner_id: userId })
    .select();

  if (error || !data)
    throw new Error(error?.message || "Failed to create a companion");
  console.log("DATA HERE:", data);

  return data;
}
