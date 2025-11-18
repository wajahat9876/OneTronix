import { Stack } from "expo-router";
// const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 500,
        contentStyle: { backgroundColor: "transparent" },
      }}
      initialRouteName="Welcome/index"
    >
      <Stack.Screen options={{ gestureEnabled: false }} name="Welcome/index" />
      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="Forgot/Business/index"
      />

      <Stack.Screen options={{ gestureEnabled: false }} name="Signin/index" />
      <Stack.Screen
        options={{
          gestureEnabled: false,
          contentStyle: { backgroundColor: "#000" },
        }}
        name="Signup/index"
      />
    </Stack>
  );
};

export default Layout;
