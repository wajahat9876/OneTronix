import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';

import { withLayoutContext } from 'expo-router';

const { Navigator } = createDrawerNavigator();

// eslint-disable-next-line import/prefer-default-export
export const Drawer = withLayoutContext<
  DrawerNavigationOptions,
  typeof Navigator,
  never,
  never
>(Navigator);
