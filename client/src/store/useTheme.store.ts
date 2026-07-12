import { create } from "zustand";
import type { ThemeStateProps } from "../types/store/useTheme.types";
import type { ThemesProps } from "../types/constants/themes.types";

export const useTheme = create<ThemeStateProps>((set) => ({
    theme: (localStorage.getItem("chat-app-theme") as ThemesProps) || "coffee",
    setTheme: (theme) => {
        localStorage.setItem("chat-app-theme", theme);
        set({ theme });
    },
}));
