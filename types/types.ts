export interface AvatarProps {
  id: string;
  name: string;
  image_url: string;
}

export interface CreateCompanionProps {
  companion_name: string;
  scene: string;
  voice: string;
  duration: string;
  avatar_id: string;
}

export interface CompanionProps {
  avatar_id: string;
  avatars: { image_url: string };
  duration: string;
  id: string;
  companion_name: string;
  owner_id: string;
  country: string;
  scene: string;
  voice: string;
  username: string;
  assistant_id: string;
}

export interface AssistantCompanionContext {
  companion_name: string;
  voice: string;
  country?: string | null;
  scene: string;
  username?: string | null;
  duration: string;
}

export interface Userprops {
  id: string;
  clerk_user_id: string;
  name: string;
  email: string;
  status: string;
  profile_picture: string;
  country: string;
  plan: string;
}
export interface VoiceProps {
  male: string;
  female: string;
}
