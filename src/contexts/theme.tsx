import type { ChildrenProps } from "../types/props";
import { createContext, useCallback, useContext, useState } from "react";
import useEffectOnce from "react-use/lib/useEffectOnce";
import useUpdateEffect from "react-use/lib/useUpdateEffect";

type ThemeValues = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeValues | null>(null);

const LOCAL_STORAGE_THEME = "theme";
const HTML_DATA_BS_THEME = "data-bs-theme";
const LIGHT = "light";
const DARK = "dark";

type Theme = typeof LIGHT | typeof DARK;

export default function ThemeProvider({ children }: ChildrenProps) {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  useEffectOnce(() => {
    const theme = localStorage.getItem(LOCAL_STORAGE_THEME) ?? "";
    if (theme === LIGHT || theme === DARK) setTheme(theme);
  });

  useUpdateEffect(() => {
    const html = document.querySelector("html")!;
    html.setAttribute(HTML_DATA_BS_THEME, theme);
    localStorage.setItem(LOCAL_STORAGE_THEME, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
