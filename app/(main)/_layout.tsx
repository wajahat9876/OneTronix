import { Stack } from "expo-router";
import UserInactivityProvider from "../context/UserInactivity";

const Layout = () => {
  return (
    <UserInactivityProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </UserInactivityProvider>
  );
};

export default Layout;
