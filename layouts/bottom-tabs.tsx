import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { withLayoutContext } from 'expo-router';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const MainStack = createBottomTabNavigator<RootTabParamList>();

// eslint-disable-next-line import/prefer-default-export
export const BottomTabs = withLayoutContext<
  BottomTabNavigationOptions,
  never,
  never,
  never
>;
