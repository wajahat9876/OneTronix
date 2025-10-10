import { Line, Text, useFont } from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

export function GeneralToolTip({
  xPos,
  xVal,
  chartBounds,
  fontSrc,
  ticks,
}: {
  xPos: SharedValue<number>; // pixel space
  xVal: SharedValue<number>; // data space (hour float)
  chartBounds: { top: number; bottom: number }; // chart height range
  fontSrc: any;
  ticks?: any;
}) {
  const font = useFont(
    fontSrc,
    ticks?.length === 5
      ? 8
      : ticks?.length === 9
      ? 6
      : ticks?.length === 13
      ? 5
      : 4
  );

  // 🕒 format hour:min
  const label = useDerivedValue(() => {
    const hour = Math.floor(xVal.value);
    const min = Math.round((xVal.value - hour) * 60);
    return `${hour}:${min.toString().padStart(2, "0")}`;
  });

  return (
    <>
      <Line
        p1={useDerivedValue(() => ({ x: xPos.value, y: chartBounds.top }))}
        p2={useDerivedValue(() => ({
          x: xPos.value,
          y: chartBounds.bottom,
        }))}
        color="rgba(31,41,55,0.85)"
        strokeWidth={0.3}
      />
      {/* time label (top of line) */}
      <Text
        x={useDerivedValue(() => xPos.value + 5)}
        y={chartBounds.top + 8}
        text={label}
        color="red"
        font={font}
      />
    </>
  );
}
