import { LinearGradient, Rect, Skia, vec } from "@shopify/react-native-skia";
import React from "react";

interface TooltipHoverProps {
  xPos: any;
  chartTop: number;
  chartBottom?: number;
  width?: number;
}

export function BarToolTip({
  xPos,
  chartTop,
  chartBottom,
  width = 20,
}: TooltipHoverProps) {
  return (
    <Rect
      x={xPos} // x position in pixels
      y={chartTop}
      width={width}
      height={chartTop}
    >
      <LinearGradient
        start={vec(0, chartTop)}
        end={vec(0, chartBottom)}
        colors={[Skia.Color("gray"), Skia.Color("gray"), Skia.Color("gray")]}
      />
    </Rect>
  );
}
