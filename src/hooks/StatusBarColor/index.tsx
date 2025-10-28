import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Platform, StatusBar } from "react-native";

/**
 * Custom hook to control StatusBar style and transparency.
 *
 * @param mode - "light" → white text/icons (for dark backgrounds)
 *                "dark" → dark text/icons (for light backgrounds)
 */
export function useStatusBar(mode: "light" | "dark" = "dark") {
  useFocusEffect(
    useCallback(() => {
      const style = mode === "light" ? "light-content" : "dark-content";

      // Set content color
      StatusBar.setBarStyle(style, true);

      // Make background transparent
      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor("transparent", true);
        StatusBar.setTranslucent(true);
      }

      // Optional cleanup on unfocus (not always necessary)
      return () => {
        // You can reset it here if you want default on unfocus
        // StatusBar.setBarStyle("dark-content", true);
      };
    }, [mode])
  );
}
