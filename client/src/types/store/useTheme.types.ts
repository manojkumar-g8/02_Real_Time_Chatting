import type { ThemesProps } from "../constants/themes.types";

export interface ThemeStateProps {
    theme: ThemesProps;
    setTheme: (theme: ThemesProps) => void;
}
