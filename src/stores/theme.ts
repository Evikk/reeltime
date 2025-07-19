import { defineStore } from "pinia";
import { ref, computed } from "vue";

const themes = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export type Theme = (typeof themes)[keyof typeof themes];

export const useThemeStore = defineStore("theme", () => {
  const currentTheme = ref<Theme>(themes.SYSTEM);

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem("theme") as Theme;

    if (savedTheme && Object.values(themes).includes(savedTheme)) {
      currentTheme.value = savedTheme;
    }

    applyTheme();
  };

  const isDark = computed(() => {
    if (currentTheme.value === themes.SYSTEM) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return currentTheme.value === themes.DARK;
  });

  const setTheme = (theme: Theme) => {
    currentTheme.value = theme;
    localStorage.setItem("theme", theme);
    applyTheme();
  };

  const toggleTheme = () => {
    if (currentTheme.value === themes.LIGHT) {
      setTheme(themes.DARK);
    } else if (currentTheme.value === themes.DARK) {
      setTheme(themes.SYSTEM);
    } else {
      setTheme(themes.LIGHT);
    }
  };

  const applyTheme = () => {
    const root = document.documentElement;

    if (isDark.value) {
      root.classList.add(themes.DARK);
    } else {
      root.classList.remove(themes.DARK);
    }
  };

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    if (currentTheme.value === themes.SYSTEM) {
      applyTheme();
    }
  });

  return {
    currentTheme,
    isDark,
    setTheme,
    toggleTheme,
    initializeTheme,
  };
});
