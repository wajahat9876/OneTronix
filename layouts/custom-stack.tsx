import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';

import { withLayoutContext } from 'expo-router';

const { Navigator } = createStackNavigator();

// eslint-disable-next-line import/prefer-default-export
export const CustomStack = withLayoutContext<
  StackNavigationOptions,
  typeof Navigator,
  never,
  never
>(Navigator);
