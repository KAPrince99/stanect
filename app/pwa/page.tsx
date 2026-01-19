import { InstallPrompt } from "@/components/ui/InstallPrompt";
import { PushNotificationsManager } from "@/components/ui/PushNotificationsManager";

export default function Page() {
  return (
    <div>
      <PushNotificationsManager />
      <InstallPrompt />
    </div>
  );
}
