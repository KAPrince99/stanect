export interface AvatarProps {
  id: string;
  name: string;
  image_url: string;
}

export interface CreateCompanionProps {
  name: string;
  venue: string;
  voice: string;
  duration: string;
  avatar_id: string;
}

export interface CompanionProps {
  avatar_id: string;
  avatars: { image_url: string };
  duration: string;
  id: string;
  name: string;
  owner_id: string;
  style: string;
  venue: string;
  voice: string;
}
