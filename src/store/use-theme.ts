import { create } from "zustand";

interface ThemeState {
  theme: "light" | "dark" | "system";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useTheme = create<ThemeState>((set) => ({
  theme: "system", // Default to System theme support
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === "light" ? "dark" : "light";
      return { theme: nextTheme };
    }),
  setTheme: (theme) =>
    set(() => ({ theme })),
}));
