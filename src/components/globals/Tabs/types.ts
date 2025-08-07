/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Entypo,
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';

export type IconSetType =
  | 'Entypo'
  | 'Ionicons'
  | 'MaterialCommunityIcons'
  | 'Feather'
  | 'FontAwesome6'
  | 'MaterialIcons';

export const iconSet = {
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  FontAwesome6,
  MaterialIcons,
};

export interface IDynamicIconProps {
  type: IconSetType;
  name: any;
  size: number;
  color: string;
}

export interface ITabsProps {
  header: {
    label: string;
    iconType: IconSetType;
    iconName: string;
  }[];
  content: any[];
}
