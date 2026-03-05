import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TabFormState {
  selectedAvatarId: string | null;
  companionName: string;
  scene: string;
  voice: "male" | "female" | null;
  sessionLength: number | null;

  setSelectedAvatarId: (id: string) => void;
  setCompanionName: (name: string) => void;
  setScene: (scene: string) => void;
  setVoice: (voice: "male" | "female") => void;
  setSessionLength: (length: number | null) => void;

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

      setSelectedAvatarId: (id) => set({ selectedAvatarId: id }),
      setCompanionName: (name) => set({ companionName: name }),
      setScene: (scene) => set({ scene }),
      setVoice: (voice) => set({ voice }),
      setSessionLength: (length) => set({ sessionLength: length }),

      reset: () =>
        set({
          selectedAvatarId: null,
          companionName: "",
          scene: "",
          voice: "male",
          sessionLength: null,
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
      }),
    },
  ),
);
