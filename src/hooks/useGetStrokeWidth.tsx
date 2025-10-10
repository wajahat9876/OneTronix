// utils/chart.ts
export const getStrokeWidth = (ticksLength?: number) => {
  switch (ticksLength) {
    case 5:
      return 1;
    case 9:
      return 0.8;
    case 13:
      return 0.7;
    case 25:
      return 0.4;
    default:
      return 0.3;
  }
};
