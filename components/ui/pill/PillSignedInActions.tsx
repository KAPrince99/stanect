import PillOnlineDot from "./PillOnlineDot";
import PillProfileLink from "./PillProfileLink";
import PillSignOutButton from "./PillSignOutButton";
import PillUpgradeLink from "./PillUpgradeLink";

export default function PillSignedInActions() {
  return (
    <>
      <div className="hidden items-center gap-4 lg:flex">
        <PillUpgradeLink />
        <PillProfileLink />
        <PillSignOutButton />
      </div>

      <PillOnlineDot />
    </>
  );
}
