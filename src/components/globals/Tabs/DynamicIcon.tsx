/* eslint-disable @typescript-eslint/no-explicit-any */

import { iconSet, IDynamicIconProps } from './types';

const DynamicIcon: React.FC<IDynamicIconProps> = ({
  type,
  name,
  size,
  color,
}) => {
  const IconComponent = iconSet[type];
  return <IconComponent name={name} size={size} color={color} />;
};

export default DynamicIcon;
