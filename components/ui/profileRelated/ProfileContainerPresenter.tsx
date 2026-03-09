import { memo, ReactNode } from "react";
import ProfileIdentityHeader from "./ProfileIdentityHeader";
import ProfileInfoList, { ProfileInfoItem } from "./ProfileInfoList";

interface ProfileContainerPresenterProps {
  imgSrc: string;
  userFullName: string;
  userFirstNameInitial: string;
  planLabel: string;
  userPlan: string;
  infoItems: ProfileInfoItem[];
  actions: ReactNode;
}

function ProfileContainerPresenter({
  imgSrc,
  userFullName,
  userFirstNameInitial,
  planLabel,
  userPlan,
  infoItems,
  actions,
}: ProfileContainerPresenterProps) {
  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden mt-5 md:backdrop-blur-2xl md:bg-white/10 md:border md:border-white/20 md:rounded-3xl md:shadow-2xl">
        <div className="grid relative p-8 md:p-10 text-center border-b border-gray-700/50">
          <ProfileIdentityHeader
            key={imgSrc}
            imgSrc={imgSrc}
            userFullName={userFullName}
            userFirstNameInitial={userFirstNameInitial}
            planLabel={planLabel}
            userPlan={userPlan}
          />

          <div className="flex gap-4 mt-10 justify-center">{actions}</div>
        </div>

        <div className="p-8 md:p-10">
          <ProfileInfoList items={infoItems} />
        </div>
      </div>
    </div>
  );
}

export default memo(ProfileContainerPresenter);
