import type { ProfileInfoItem } from "./ProfileInfoList";
import LordIcon from "../lordIcon";

interface BuildProfileInfoItemsParams {
  userEmail: string;
  userCountry: string;
  joinedDate: string;
  displayTime: string;
}

const PROFILE_INFO_META: Array<{
  key: "email" | "location" | "joinedDate" | "displayTime";
  label: string;
  icon: ProfileInfoItem["icon"];
}> = [
  {
    key: "email",
    label: "Email",
    icon: (
      <LordIcon
        src="https://cdn.lordicon.com/gtvaxhwv.json"
        trigger="hover"
        colors="primary:#e88c30,secondary:#ebe6ef,tertiary:#e88c30,quaternary:#e88c30"
        height={35}
        width={35}
      />
    ),
  },
  {
    key: "location",
    label: "Location",
    icon: (
      <LordIcon
        src="https://cdn.lordicon.com/tyntlpjn.json"
        trigger="hover"
        colors="primary:#ffffff,secondary:#e88c30"
        height={35}
        width={35}
      />
    ),
  },
  {
    key: "joinedDate",
    label: "Member Since",
    icon: (
      <LordIcon
        src="https://cdn.lordicon.com/laobovmg.json"
        trigger="hover"
        colors="primary:#e88c30"
        height={35}
        width={35}
      />
    ),
  },
  {
    key: "displayTime",
    label: "Total Talk Time",
    icon: (
      <LordIcon
        src="https://cdn.lordicon.com/zjuyeglr.json"
        trigger="hover"
        colors="primary:#e88c30"
        height={35}
        width={35}
      />
    ),
  },
];

export function buildProfileInfoItems({
  userEmail,
  userCountry,
  joinedDate,
  displayTime,
}: BuildProfileInfoItemsParams): ProfileInfoItem[] {
  return PROFILE_INFO_META.map((item) => {
    if (item.key === "email") {
      return { icon: item.icon, label: item.label, value: userEmail };
    }

    if (item.key === "location") {
      return { icon: item.icon, label: item.label, value: userCountry };
    }

    if (item.key === "joinedDate") {
      return { icon: item.icon, label: item.label, value: joinedDate };
    }

    return { icon: item.icon, label: item.label, value: displayTime };
  });
}
