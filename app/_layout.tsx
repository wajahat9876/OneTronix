/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line import/extensions
import { PortalProvider } from "@gorhom/portal";
import { SelectProvider } from "@mobile-reality/react-native-select-pro";
import CheckNetwork from "@src/components/globals/CheckNetwork";
import useCachedResources from "@src/hooks/useCachedResources";
import store from "@store/index";
import { toastConfig } from "@utils/helpers/toast";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

// eslint-disable-next-line prettier/prettier
export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});
const persistor = persistStore(store);

const ReduxWrapper = () => {
  const isLoadingComplete = useCachedResources();
  // const [loaded, error] = useFonts({
  //   SpaceMono: SpaceMonoFont,
  // });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  // useEffect(() => {
  //   if (error) throw error;
  // }, [error]);
  (Text as any).defaultProps = (Text as any).defaultProps || {};
  (Text as any).defaultProps.allowFontScaling = false;

  (TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
  (TextInput as any).defaultProps.allowFontScaling = false;

  //Restrict to use only app font
  // 👇 Apply your global font
  (Text as any).defaultProps = (Text as any).defaultProps || {};
  (Text as any).defaultProps.style = { fontFamily: "Ranade-Regular" }; // your custom font name

  (TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
  (TextInput as any).defaultProps.style = { fontFamily: "Ranade-Regular" };
  useEffect(() => {
    if (isLoadingComplete) {
      SplashScreen.hideAsync();
    }
  }, [isLoadingComplete]);

  if (!isLoadingComplete) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <>
      <Slot
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
};

const RootLayout = () => {
  return (
    <SelectProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <PaperProvider
                  theme={{
                    ...DefaultTheme,
                    colors: {
                      ...DefaultTheme.colors,
                      secondaryContainer: "transparent",
                    },
                  }}
                >
                  <PortalProvider>
                    <ReduxWrapper />
                  </PortalProvider>
                  <CheckNetwork />
                </PaperProvider>
              </PersistGate>
            </Provider>
            <Toast config={toastConfig} />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </SelectProvider>
  );
};

export default RootLayout;
