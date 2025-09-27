// utils/chart.ts
export const getStrokeWidth = (ticksLength?: number) => {
  switch (ticksLength) {
    case 5:
      return 1;
    case 9:
      return 0.8;
    case 13:
      return 0.6;
    case 25:
      return 0.5;
    default:
      return 0.4;
  }
};
