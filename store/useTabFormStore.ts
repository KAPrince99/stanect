import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PLAN_LIMITS, type PlanType } from "@/lib/plan-limits";

const getMaxMinutesByPlan = (plan: PlanType) =>
  Math.floor(PLAN_LIMITS[plan].sessionLimit / 60);

interface TabFormState {
  selectedAvatarId: string | null;
  companionName: string;
  scene: string;
  voice: "male" | "female" | null;
  sessionLength: number | null;
  userPlan: PlanType;

  setSelectedAvatarId: (id: string) => void;
  setCompanionName: (name: string) => void;
  setScene: (scene: string) => void;
  setVoice: (voice: "male" | "female") => void;
  setSessionLength: (length: number | null) => void;
  setUserPlan: (plan: PlanType) => void;

  reset: () => void;
}

export const useTabFormStore = create<TabFormState>()(
  persist(
    (set) => ({
      selectedAvatarId: null,
      companionName: "",
      scene: "",
      voice: "male",
      sessionLength: null,
      userPlan: "free",

      setSelectedAvatarId: (id) => set({ selectedAvatarId: id }),
      setCompanionName: (name) => set({ companionName: name }),
      setScene: (scene) => set({ scene }),
      setVoice: (voice) => set({ voice }),
      setSessionLength: (length) =>
        set((state) => {
          if (length === null) return { sessionLength: null };

          const maxMinutes = getMaxMinutesByPlan(state.userPlan);
          return { sessionLength: Math.min(length, maxMinutes) };
        }),

      setUserPlan: (plan) =>
        set((state) => {
          const maxMinutes = getMaxMinutesByPlan(plan);
          const clampedSessionLength =
            state.sessionLength === null
              ? null
              : Math.min(state.sessionLength, maxMinutes);

          return {
            userPlan: plan,
            sessionLength: clampedSessionLength,
          };
        }),

      reset: () =>
        set({
          selectedAvatarId: null,
          companionName: "",
          scene: "",
          voice: "male",
          sessionLength: null,
          userPlan: "free",
        }),
    }),
    {
      name: "tab-form-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedAvatarId: state.selectedAvatarId,
        companionName: state.companionName,
        scene: state.scene,
        voice: state.voice,
        sessionLength: state.sessionLength,
        userPlan: state.userPlan,
      }),
    },
  ),
);
