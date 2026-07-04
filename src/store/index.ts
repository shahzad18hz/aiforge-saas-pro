import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UserState {
  credits: number;
  plan: "free" | "pro";
  setCredits: (credits: number) => void;
  setPlan: (plan: "free" | "pro") => void;
  decrementCredits: (amount: number) => void;
}

interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

interface GenerationState {
  isGenerating: boolean;
  lastResult: string | null;
  setIsGenerating: (v: boolean) => void;
  setLastResult: (result: string | null) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        credits: 0,
        plan: "free",
        setCredits: (credits) => set({ credits }),
        setPlan: (plan) => set({ plan }),
        decrementCredits: (amount) => set((state) => ({ credits: Math.max(0, state.credits - amount) })),
      }),
      { name: "user-store" }
    )
  )
);

export const useUIStore = create<UIState>()(
  devtools((set) => ({
    sidebarOpen: true,
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  }))
);

export const useGenerationStore = create<GenerationState>()(
  devtools((set) => ({
    isGenerating: false,
    lastResult: null,
    setIsGenerating: (v) => set({ isGenerating: v }),
    setLastResult: (result) => set({ lastResult: result }),
  }))
);
