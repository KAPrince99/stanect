import { memo, ReactNode } from "react";
import { InfoItem } from "@/components/ui/InfoItem";

export interface ProfileInfoItem {
  icon: ReactNode;
  label: string;
  value: string;
}

interface ProfileInfoListProps {
  items: ProfileInfoItem[];
}

function ProfileInfoList({ items }: ProfileInfoListProps) {
  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      {items.map((item) => (
        <InfoItem key={item.label} {...item} />
      ))}
    </div>
  );
}

export default memo(ProfileInfoList);
