/* eslint-disable import/extensions */
/* eslint-disable global-require */
import { FontAwesome } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

const useCachedResources = () => {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();
        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          "space-mono": require("@assets/fonts/SpaceMono-Regular.ttf"),
          "poppins-bold": require("@assets/fonts/Poppins/Poppins-Bold.ttf"),
          "poppins-semibold": require("@assets/fonts/Poppins/Poppins-SemiBold.ttf"),
          "poppins-light": require("@assets/fonts/Poppins/Poppins-Light.ttf"),
          "poppins-medium": require("@assets/fonts/Poppins/Poppins-Medium.ttf"),
          poppins: require("@assets/fonts/Poppins/Poppins-Regular.ttf"),
          "poppins-thin": require("@assets/fonts/Poppins/Poppins-Thin.ttf"),

          "Excon-Medium": require("@assets/fonts/Excon_Complete/Fonts/OTF/Excon-Medium.otf"),
          "Excon-Regular": require("@assets/fonts/Excon_Complete/Fonts/OTF/Excon-Regular.otf"),
          "Excon-medium": require("@assets/fonts/Excon_Complete/Fonts/OTF/Excon-Medium.otf"),
          "Excon-Light": require("@assets/fonts/Excon_Complete/Fonts/OTF/Excon-Light.otf"),

          "Excon-Black": require("@assets/fonts/Excon_Complete/Fonts/OTF/Excon-Black.otf"),
          "Ranade-Medium": require("@assets/fonts/Ranade_Complete/Fonts/OTF/Ranade-Medium.otf"),
          "Ranade-Regular": require("@assets/fonts/Ranade_Complete/Fonts/OTF/Ranade-Regular.otf"),
          "Ranade-Thin": require("@assets/fonts/Ranade_Complete/Fonts/OTF/Ranade-Thin.otf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }
    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
};

export default useCachedResources;
