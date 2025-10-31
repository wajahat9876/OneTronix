import ZoomOut from "@assets/icons/Zoomout.png";
import ZoomIn from "@assets/icons/zoomin.png";
import { ms, vs } from "@utils/design/design";
import React, { useMemo, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import {
  Area,
  Chart,
  HorizontalAxis,
  Line,
  VerticalAxis,
} from "react-native-responsive-linechart";
interface PowerData {
  hour: number;
  Purchase: number;
  Charging: number;
  Discharging: number;
  Consumption: number;
  Solar: number;
}

interface PinchZoomLineChartProps {
  data: PowerData[];
  selectedParams: (keyof PowerData)[];
  title?: string;
  selectTab: number; // 👈 added prop
}

export default function PinchZoomLineChart({
  data,
  selectedParams,
  title = "Power Overview",
  selectTab,
}: PinchZoomLineChartProps) {
  const colors: Record<keyof PowerData, string> = {
    hour: "#000000",
    Purchase: "#0770FF",
    Charging: "#F2597F",
    Discharging: "gray",
    Consumption: "#F7D102",
    Solar: "black",
  };

  const visibleKeys = selectedParams?.filter((key) =>
    ["Purchase", "Charging", "Discharging", "Consumption", "Solar"].includes(
      key
    )
  );

  const baseKey = visibleKeys[0] ?? "ac";
  const xMax = 24;

  const globalMaxY = Math.max(
    ...data?.flatMap((d) => [
      d.Purchase,
      d.Charging,
      d.Discharging,
      d.Consumption,
      d.Solar,
    ]),
    0
  );

  const [viewport, setViewport] = useState({
    size: { width: 24, height: globalMaxY && globalMaxY > 0 ? globalMaxY : 10 },
    origin: { x: 0 },
  });

  // Whenever data updates, adjust height dynamically (width stays 24 if initial)
  React.useEffect(() => {
    const safeHeight = globalMaxY && globalMaxY > 0 ? globalMaxY : 10;
    setViewport((prev) => ({
      ...prev,
      size: { ...prev.size, height: safeHeight },
    }));
  }, [globalMaxY]);

  // 🧩 Mounted Ref — prevents runOnJS after unmount
  const [tooltipX, setTooltipX] = useState<number | null>(null);

  // --- ZOOM ---
  const handleZoom = (scale: number) => {
    if (selectTab !== 0) return;
    setViewport((v) => {
      const newWidth = Math.max(0.2, Math.min(v.size.width / scale, xMax));
      return { ...v, size: { ...v.size, width: newWidth } };
    });
  };

  // --- PAN ---
  const handlePan = (translationX: number) => {
    if (selectTab !== 0) return;
    setViewport((v) => {
      const delta = translationX / 50;
      const newOrigin = Math.max(
        0,
        Math.min(v.origin.x - delta, xMax - v.size.width)
      );
      return { ...v, origin: { x: newOrigin } };
    });
  };
  const handleZoomIn = () => handleZoom(1.5);
  const handleZoomOut = () => handleZoom(0.7);
  // ✅ Disable gestures entirely if tab != 1
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      if (selectTab === 0) runOnJS(handleZoom)(e.scale);
    })
    .enabled(selectTab === 0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (selectTab === 0) runOnJS(handlePan)(e.translationX);
    })
    .enabled(selectTab === 0);

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const formatHourToAmPm = (hour: number) => {
    const totalMinutes = hour * 60;
    const hrs = Math.floor(totalMinutes / 60) % 24;
    const mins = Math.floor(totalMinutes % 60);
    const suffix = hrs >= 12 ? "PM" : "AM";
    const displayHour = hrs % 12 === 0 ? 12 : hrs % 12;
    if (mins === 0) return `${displayHour} ${suffix}`;
    return `${displayHour}:${mins.toString().padStart(2, "0")} ${suffix}`;
  };

  const tickValues = useMemo(() => {
    const visibleWidth = viewport.size.width;
    if (visibleWidth > 12) return [0, 6, 12, 18, 24];
    else if (visibleWidth > 6)
      return Array.from({ length: 9 }, (_, i) => i * 3);
    else if (visibleWidth > 3) return Array.from({ length: 25 }, (_, i) => i);
    else if (visibleWidth > 0.5)
      return Array.from({ length: 49 }, (_, i) => i * 0.5);
    else {
      const step = 5 / 60;
      const count = Math.floor(24 / step);
      return Array.from({ length: count + 1 }, (_, i) => i * step);
    }
  }, [viewport.size.width]);

  const formatKW = (val: number) => `${val.toFixed(1)} kW`;

  if (!data?.length || !data.some((d) => Number.isFinite(d.hour))) {
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <Text>No valid data</Text>
      </View>
    );
  }

  const [legendValues, setLegendValues] = useState<
    Record<string, number | undefined>
  >({});
  const paramDisplayNames: Record<string, string> = {
    Purchase: "Purchasing Power",
    Consumption: "Consumption Power",
    Charging: "Charging Power",
    Discharging: "Discharging Power",
    Solar: "Solar Power",
  };
  return (
    <GestureDetector gesture={composedGesture}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginRight: 20,
          }}
        >
          <View style={{ paddingHorizontal: 16, marginLeft: 10 }}>
            {selectedParams.map((param, index) => {
              const value = legendValues[param] ?? "--";
              const displayName = paramDisplayNames[param] ?? param;
              return (
                <View
                  key={`${param}-${index}`}
                  style={[
                    styles.dotText,
                    { marginRight: 6, marginTop: vs(10) },
                  ]}
                >
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: colors[param] ?? "#000" },
                    ]}
                  />
                  <Text
                    style={{
                      color: "#111",
                      fontSize: ms(11),
                      fontFamily: "Ranade-Regular",
                    }}
                  >
                    {displayName}: {value}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={{ flexDirection: "row", alignSelf: "center", gap: 10 }}>
            <TouchableOpacity onPress={handleZoomOut}>
              <Image source={ZoomOut} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleZoomIn}>
              <Image source={ZoomIn} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
          </View>
        </View>
        <Chart
          style={{ height: vs(370), width: "100%" }}
          data={data?.map((d) => ({
            x: d.hour,
            y: d[baseKey] ?? 0,
          }))}
          padding={{ left: 40, bottom: 20, right: 15, top: 20 }}
          xDomain={{ min: 0, max: xMax }}
          yDomain={{ min: 0, max: globalMaxY }}
          viewport={viewport}
        >
          <VerticalAxis
            tickValues={[0, globalMaxY > 0 ? globalMaxY : 1]}
            theme={{
              grid: { stroke: { color: "#ccc", width: 0.5 } },
              axis: { stroke: { color: "gray", width: 1 } },
              ticks: { stroke: { color: "#ccc", width: 0.3 } },
              labels: {
                label: {
                  fontSize: ms(10),
                  fontFamily: "Ranade-Medium",
                },
                formatter: (v: number) =>
                  v === 0 ? "0 kW" : formatKW(globalMaxY),
              },
            }}
          />

          <HorizontalAxis
            tickValues={tickValues}
            theme={{
              grid: { stroke: { color: "#ccc", width: 0.5 } },
              axis: { stroke: { color: "gray", width: 1 } },
              ticks: { stroke: { color: "#ccc", width: 1 } },
              labels: {
                label: {
                  rotation: 0,
                  fontSize: ms(10),
                  fontFamily: "Ranade-Medium",
                },
                formatter: (v) => formatHourToAmPm(v),
              },
            }}
          />

          {visibleKeys.map((key, index) => (
            <React.Fragment key={`${key}-${index}`}>
              <Line
                data={data.map((d) => ({ x: d.hour, y: d[key] }))}
                theme={{
                  stroke: { color: colors[key], width: 2 },
                }}
                smoothing="cubic-spline"
                onTooltipSelect={(value) => {
                  setTooltipX(value.x);
                  setLegendValues((prev) => ({
                    ...prev,
                    [key]: value.y, // map y-value of tooltip to legend
                  }));
                }}
                onTooltipSelectEnd={() => {
                  // optional: reset tooltip values when user stops touching
                  setLegendValues((prev) => ({
                    ...prev,
                    [key]: undefined,
                  }));
                }}
              />
              <Area
                data={data.map((d) => ({ x: d.hour, y: d[key] }))}
                theme={{
                  gradient: {
                    from: { color: colors[key], opacity: 0.3 },
                    to: { color: colors[key], opacity: 0.05 },
                  },
                }}
                smoothing="cubic-spline"
              />
            </React.Fragment>
          ))}
          {tooltipX !== null && (
            <Line
              data={[
                { x: tooltipX, y: 0 },
                { x: tooltipX, y: globalMaxY },
              ]}
              theme={{
                stroke: { color: "gray", width: 0.7 },
              }}
            />
          )}
        </Chart>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 5 },
  title: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  dotText: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  colorDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    flexWrap: "wrap",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 6,
    marginVertical: 4,
  },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 4 },
  legendLabel: { fontSize: 12, color: "#333" },
});
