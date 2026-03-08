import type { ProfileInfoItem } from "./ProfileInfoList";
import LordIcon from "./lordIcon";

interface BuildProfileInfoItemsParams {
  userEmail: string;
  userCountry: string;
  joinedDate: string;
  displayTime: string;
}

export function buildProfileInfoItems({
  userEmail,
  userCountry,
  joinedDate,
  displayTime,
}: BuildProfileInfoItemsParams): ProfileInfoItem[] {
  return [
    {
      icon: (
        <LordIcon
          src="https://cdn.lordicon.com/gtvaxhwv.json"
          trigger="hover"
          colors="primary:#e88c30,secondary:#ebe6ef,tertiary:#e88c30,quaternary:#e88c30"
          height={35}
          width={35}
        />
      ),
      label: "Email",
      value: userEmail,
    },
    {
      icon: (
        <LordIcon
          src="https://cdn.lordicon.com/tyntlpjn.json"
          trigger="hover"
          colors="primary:#ffffff,secondary:#e88c30"
          height={35}
          width={35}
        />
      ),
      label: "Location",
      value: userCountry,
    },
    {
      icon: (
        <LordIcon
          src="https://cdn.lordicon.com/laobovmg.json"
          trigger="hover"
          colors="primary:#e88c30"
          height={35}
          width={35}
        />
      ),
      label: "Member Since",
      value: joinedDate,
    },
    {
      icon: (
        <LordIcon
          src="https://cdn.lordicon.com/zjuyeglr.json"
          trigger="hover"
          colors="primary:#e88c30"
          height={35}
          width={35}
        />
      ),
      label: "Total Talk Time",
      value: displayTime,
    },
  ];
}
