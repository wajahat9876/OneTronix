import {
  BottomSheetNavigationOptions,
  createBottomSheetNavigator,
} from '@th3rdwave/react-navigation-bottom-sheet';

import { withLayoutContext } from 'expo-router';

const { Navigator } = createBottomSheetNavigator();

// eslint-disable-next-line import/prefer-default-export
export const BottomSheet = withLayoutContext<
  BottomSheetNavigationOptions,
  typeof Navigator,
  never,
  never
>(Navigator);
