import { Line, Text, useFont } from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

export function GeneralToolTip({
  xPos,
  xVal,
  chartBounds,
  fontSrc,
}: {
  xPos: SharedValue<number>; // pixel space
  xVal: SharedValue<number>; // data space (hour float)
  chartBounds: { top: number; bottom: number }; // chart height range
  fontSrc: any;
}) {
  const font = useFont(fontSrc, 8);

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
        color="gray"
        strokeWidth={0.5}
      />
      {/* time label (top of line) */}
      <Text
        x={useDerivedValue(() => xPos.value + 5)}
        y={chartBounds.top + 15}
        text={label}
        color="black"
        font={font}
      />
    </>
  );
}
