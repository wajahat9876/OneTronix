import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { StatusBar } from "react-native";

/**
 * Hook to control StatusBar style when a screen is focused.
 *
 * @param mode "light" | "dark"
 * - "light" → white text/icons (for dark backgrounds)
 * - "dark" → dark text/icons (for light backgrounds)
 */
export function useStatusBar(mode: "light" | "dark" = "dark") {
  useFocusEffect(
    useCallback(() => {
      const style = mode === "light" ? "light-content" : "dark-content";
      StatusBar.setBarStyle(style, true);

      // Optional cleanup: restore to default if screen unfocused
      return () => {
        // You can reset or leave as-is
      };
    }, [mode])
  );
}
