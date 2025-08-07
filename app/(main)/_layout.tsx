import { Stack } from 'expo-router';
import UserInactivityProvider from '../context/UserInactivity';

// import { UserInactivityProvider } from '../context/UserInactivity';

const Layout = () => {
  return (
    <>
      <UserInactivityProvider />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
};

export default Layout;
