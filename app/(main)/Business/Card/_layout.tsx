import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 500,
      }}
      initialRouteName="index"
    >
      <Stack.Screen name="CardDetails/index" />
      <Stack.Screen name="ChangeCardPin/index" />
      <Stack.Screen name="ActivateDebitCard/index" />
      <Stack.Screen name="ReportCard/index" />
    </Stack>
  );
};
export default Layout;
