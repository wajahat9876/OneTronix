import SolarIcon from "@assets/HomeIcons/SolarIcon.png";
import BatteryIcon from "@assets/HomeIcons/batteryIcon.png";
import GridIcon from "@assets/HomeIcons/gridIcon.png";
import HomeIcon from "@assets/HomeIcons/homeIcon.png";
import InverterIcon from "@assets/HomeIcons/inverterIcon.png";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import Svg, { Defs, Marker, Path } from "react-native-svg";
// Animated Path
const AnimatedPath = Animated.createAnimatedComponent(Path);

const AnimatedLinePath = ({
  d,
  color = "#000",
  active = false,
  direction = "forward",
}) => {
  const dashOffset = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);
  const [dotPos, setDotPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const pathRef = useRef<any>(null);
  useEffect(() => {
    if (active) {
      const toVal = direction === "forward" ? -400 : 400;
      animRef.current = Animated.loop(
        Animated.timing(dashOffset, {
          toValue: toVal,
          duration: 4000,
          useNativeDriver: false,
        })
      );
      animRef.current.start();
      return () => {
        if (animRef.current) animRef.current?.stop();
      };
    }

    // stop + reset
    if (!active) {
      if (animRef.current) {
        animRef.current?.stop();
        animRef.current = null;
      }
      dashOffset.stopAnimation(() => dashOffset.setValue(0));
    }
    return undefined;
  }, [active, direction, dashOffset]);

  return (
    <>
      {/* Full gray line */}
      <Path
        d={d}
        stroke="lightgrey"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />

      {/* Shorter animated green line */}
      <AnimatedPath
        d={d}
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeDasharray="120,80" // 👈 green line ki length control
        strokeDashoffset={dashOffset}
        opacity={active ? 1 : 0}
        strokeLinecap="round" // <-- makes one end rounded like a dot
        strokeLinejoin="round"
      />
    </>
  );
};

const FlowDiagram = ({
  solar = 0,
  grid = 0,
  consumption = 0,
  battery = 0,
  batteryWatt = 0, // 🔹 Wattage from API
  batteryStatus = "onHold", // 🔹 "charging" | "discharging" | "onHold"
}) => {
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const iconSize = 60;
  const topOffset = 20;
  const bottomOffset = 60;

  const onLayout = (e: any) => {
    const { width, height } = e.nativeEvent.layout;
    setLayout({ width, height });
  };

  // helper: build elbow path (inverter -> left target)
  const makeElbowLeft = (
    from: { x: number; y: number },
    to: { x: number; y: number },
    elbowInset = 40,
    curveRadius = 40
  ) => {
    const midX = to.x + elbowInset;

    return `
    M ${from.x} ${from.y}
    L ${midX} ${from.y}
    Q ${midX - curveRadius} ${from.y} ${midX - curveRadius} ${
      from.y + curveRadius
    }
    L ${midX - curveRadius} ${to.y}
    L ${to.x} ${to.y}
  `;
  };

  const makeElbowRight = (
    from: { x: number; y: number },
    to: { x: number; y: number },
    elbowInset = 40,
    curveRadius = 40
  ) => {
    const midX = to.x - elbowInset;

    return `
    M ${from.x} ${from.y}
    L ${midX} ${from.y}
    Q ${midX + curveRadius} ${from.y} ${midX + curveRadius} ${
      from.y + curveRadius
    }
    L ${midX + curveRadius} ${to.y}
    L ${to.x} ${to.y}
  `;
  };
  const makeStraight = (from: { x: any; y: any }, to: { x: any; y: any }) => {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  };

  // Wait until we have layout measured
  const ready = layout.width > 0 && layout.height > 0;

  // compute positions (centers)
  const centerX = ready ? layout.width / 2 : 0;
  const solarPos = { x: centerX, y: topOffset + iconSize / 2 };

  const batteryPos = {
    x: 42 + iconSize / 2,
    y: ready ? layout.height - bottomOffset - iconSize / 2 : 300,
  };
  const gridPos = {
    x: centerX,
    y: ready ? layout.height - bottomOffset - iconSize / 2 : 300,
  };
  const loadPos = {
    x: ready ? layout.width - 42 - iconSize / 2 : 320,
    y: ready ? layout.height - bottomOffset - iconSize / 2 : 300,
  };
  const inverterPos = {
    x: centerX,
    y: ready ? (solarPos.y + gridPos.y) / 2 : 0, // fallback to 0
  };
  // slightly offset endpoints so line doesn't go under icon center

  const GAP = 6; // distance between line and icon
  const R = iconSize / 2; // icon radius

  const edge = (
    pt: { x: number; y: number },
    side: "top" | "bottom" | "left" | "right"
  ) => {
    switch (side) {
      case "top":
        return { x: pt.x, y: pt.y - (R + GAP) };
      case "bottom":
        return { x: pt.x, y: pt.y + (R + GAP) };
      case "left":
        return { x: pt.x - (R + GAP), y: pt.y };
      case "right":
        return { x: pt.x + (R + GAP), y: pt.y };
      default:
        return pt;
    }
  };

  // from/to points for nicer connection (so line ends near icon edge not at exact center)
  const solarTo = edge(inverterPos, "top");
  const solarFrom = edge(solarPos, "bottom");

  const invLeft = edge(inverterPos, "left"); // leave inverter to the left
  const invRight = edge(inverterPos, "right"); // leave inverter to the right
  const invBottom = edge(inverterPos, "bottom"); // leave inverter to the bottom

  const batTop = edge(batteryPos, "top"); // arrive battery from top
  const gridTop = edge(gridPos, "top"); // arrive grid from top
  const loadTop = edge(loadPos, "top"); // arrive load from top

  // helper to stop line before touching icon

  // build path strings (pixel values)
  const pathSolar = makeStraight(solarFrom, solarTo);
  const pathBattery = makeElbowLeft(invLeft, batTop, 30, 30); // a bit more inset/radius
  const pathGrid = makeStraight(invBottom, gridTop);
  const pathLoad = makeElbowRight(invRight, loadTop, 30, 30);
  return (
    <View style={styles.wrapper}>
      <View style={styles.container} onLayout={onLayout}>
        {ready && (
          <>
            {/* Icons (absolute, using computed centers) */}
            <View
              style={{
                position: "absolute",
                left: solarPos.x - iconSize / 2,
                top: solarPos.y - iconSize / 2,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={SolarIcon}
                style={{
                  width: iconSize,
                  height: iconSize,
                  resizeMode: "contain",
                }}
              />
              <Text style={[styles.label, { marginLeft: 50 }]}>Solar</Text>
              <Text style={{ top: 15, marginLeft: 25, fontSize: 11 }}>
                {solar} w
              </Text>
            </View>

            <Image
              source={InverterIcon}
              style={[
                styles.icon,
                {
                  left: inverterPos.x - iconSize / 2,
                  top: inverterPos.y - iconSize / 2,
                },
              ]}
            />
            {/* <Text
              style={[
                styles.label,
                {
                  left: inverterPos.x - 35,
                  top: inverterPos.y + iconSize / 2 + 6,
                },
              ]}
            >
              Inverter
            </Text> */}

            <Image
              source={BatteryIcon}
              style={[
                styles.icon,
                {
                  left: batteryPos.x - iconSize / 2,
                  top: batteryPos.y - iconSize / 2,
                },
              ]}
            />
            <Text
              style={[
                styles.label,
                {
                  left: batteryPos.x - 40,
                  top: batteryPos.y + iconSize / 2 + 6,
                },
              ]}
            >
              Batteries
            </Text>
            <Text
              style={[
                styles.value,
                {
                  left: batteryPos.x - 40,
                  top: batteryPos.y + iconSize / 2 + 24,
                },
              ]}
            >
              {batteryWatt} w
            </Text>
            <Image
              source={GridIcon}
              style={[
                styles.icon,
                {
                  left: gridPos.x - iconSize / 2,
                  top: gridPos.y - iconSize / 2,
                },
              ]}
            />
            <Text
              style={[
                styles.label,
                { left: gridPos.x - 40, top: gridPos.y + iconSize / 2 + 6 },
              ]}
            >
              Grid
            </Text>
            <Text
              style={[
                styles.value,
                { left: gridPos.x - 40, top: gridPos.y + iconSize / 2 + 24 },
              ]}
            >
              {grid} w
            </Text>

            <Image
              source={HomeIcon}
              style={[
                styles.icon,
                {
                  left: loadPos.x - iconSize / 2,
                  top: loadPos.y - iconSize / 2,
                },
              ]}
            />
            <Text
              style={[
                styles.label,
                { left: loadPos.x - 40, top: loadPos.y + iconSize / 2 + 6 },
              ]}
            >
              Load
            </Text>
            <Text
              style={[
                styles.value,
                { left: loadPos.x - 40, top: loadPos.y + iconSize / 2 + 24 },
              ]}
            >
              {consumption} w
            </Text>

            {/* SVG lines (paths with elbow shapes) */}
            <Svg
              height={layout.height}
              width={layout.width}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            >
              <Defs>
                {/* you can add arrow markers here if needed */}
                <Marker
                  id="arrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <Path d="M0,0 L6,3 L0,6 z" fill="#000" />
                </Marker>
              </Defs>

              {/* Solar -> Inverter */}
              <AnimatedLinePath
                d={pathSolar}
                color="#27ae60"
                active={solar > 0}
                direction="forward"
              />

              {/* Inverter -> Battery (elbow left) */}
              <AnimatedLinePath
                d={pathBattery}
                color="#27ae60"
                active={batteryWatt > 0 && batteryStatus !== "ONHOLD"}
                direction={
                  batteryStatus === "CHARGING"
                    ? "forward" // inverter -> battery
                    : batteryStatus === "DISCHARGING"
                    ? "backward" // battery -> inverter
                    : "forward" // default (but inactive if onHold or watt 0)
                }
              />

              {/* Inverter -> Grid */}
              <AnimatedLinePath
                d={pathGrid}
                color="#27ae60"
                active={grid !== 0}
                direction={grid > 0 ? "forward" : "backward"}
              />

              {/* Inverter -> Load (elbow right) */}
              <AnimatedLinePath
                d={pathLoad}
                color="#27ae60"
                active={consumption > 0}
                direction="forward"
              />
            </Svg>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { padding: 0 },
  container: {
    height: 360,
    backgroundColor: "transparent",
    position: "relative",
  },
  icon: {
    position: "absolute",
    width: 55,
    height: 50,
    resizeMode: "contain",
    // tintColor: "#444",
  },
  label: {
    position: "absolute",
    fontSize: 13,
    width: 80,
    fontWeight: "600",
    textAlign: "center",
  },
  value: {
    position: "absolute",
    fontSize: 11,
    width: 80,
    textAlign: "center",
  },
});

export default FlowDiagram;
