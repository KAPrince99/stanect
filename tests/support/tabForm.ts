import { useTabFormStore } from "@/store/useTabFormStore";

export function resetTabFormStore() {
  localStorage.removeItem("tab-form-storage");
  localStorage.removeItem("stanect:lastCompanionId");
  useTabFormStore.setState({
    selectedAvatarId: null,
    companionName: "",
    scene: "",
    voice: "male",
    sessionLength: null,
    userPlan: "free",
  });
}
