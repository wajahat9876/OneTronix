import {
  createMaterialBottomTabNavigator,
  MaterialBottomTabNavigationOptions,
} from '@react-navigation/material-bottom-tabs';

import { withLayoutContext } from 'expo-router';

const { Navigator } = createMaterialBottomTabNavigator();

// eslint-disable-next-line import/prefer-default-export
export const MaterialBottomTabs = withLayoutContext<
  MaterialBottomTabNavigationOptions,
  typeof Navigator,
  never,
  never
>(Navigator);
