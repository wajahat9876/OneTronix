import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 500,
      }}
      initialRouteName="index"
    >
      <Stack.Screen name="Accounts/index" />
    </Stack>
  );
};
export default Layout;
