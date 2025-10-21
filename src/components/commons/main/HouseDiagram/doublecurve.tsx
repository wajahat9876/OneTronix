import Diagram from "@assets/icons/diagram.png";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import Svg, { Defs, Marker, Path } from "react-native-svg";

// --- Animated Line Path Component ---
const AnimatedPath = Animated.createAnimatedComponent(Path);

const AnimatedLinePath = ({
  d,
  color = "#27ae60",
  active = false,
  direction = "forward",
}) => {
  const dashOffset = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (active) {
      const toVal = direction === "forward" ? -400 : 400;

      // Create a looping animation and store in ref
      animRef.current = Animated.loop(
        Animated.timing(dashOffset, {
          toValue: toVal,
          duration: 4000,
          useNativeDriver: false,
        })
      );

      animRef.current.start();

      return () => {
        // ✅ Properly stop when unmounting or deactivating
        animRef.current?.stop();
      };
    } else {
      animRef.current?.stop();
      dashOffset.stopAnimation(() => dashOffset.setValue(0));
    }
  }, [active, direction]);

  return (
    <>
      {/* Gray base line */}
      <Path
        d={d}
        stroke="lightgray"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />

      {/* Animated flowing line */}
      <AnimatedPath
        d={d}
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeDasharray="120,80"
        strokeDashoffset={dashOffset}
        opacity={active ? 1 : 0}
        strokeLinecap="round"
      />
    </>
  );
};

// --- Main Diagram ---
interface HouseDiagramProps {
  solar?: number; // kW
  home?: number; // kW
  grid?: number; // kW (+ve import, -ve export)
  battery?: number; // kW
  batteryStatus?: "CHARGING" | "DISCHARGING" | "ONHOLD";
  batteryWatt?: number; // current battery watt
}
const HouseDiagram = (props: HouseDiagramProps) => {
  const {
    solar = 0,
    home = 0,
    grid = 0,
    battery = 0,
    batteryStatus = "ONHOLD",
    batteryWatt = 0,
  } = props;
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const onLayout = (e: any) => {
    const { width, height } = e.nativeEvent.layout;
    setLayout({ width, height });
  };

  const ready = layout.width > 0 && layout.height > 0;

  // --- approximate coordinates over the 3D house image ---
  const inverter = { x: 260, y: 160 };
  const solarPos = { x: 260, y: 110 };
  const batteryPos = { x: 260, y: 200 };
  const gridPos = { x: 360, y: 160 };
  const homePos = { x: 160, y: 180 };

  const GAP = 10; // simple fixed pixel offset from inverter
  const makeDoubleLeftTurnPath = (
    from: { x: number; y: number }, // inverter
    to: { x: number; y: number }, // home
    upLength = 40, // how far it goes up
    firstLeftLength = 40, // first horizontal left segment
    secondLeftLength = 80, // second longer left segment
    downOffset = 20, // small offset for downward turn
    curveRadius = 20 // smoothness of corners
  ) => {
    const upY = from.y - upLength;
    const firstLeftX = from.x - firstLeftLength;
    const secondLeftX = from.x - firstLeftLength - secondLeftLength;

    return (
      `M ${from.x} ${from.y} ` + // start at inverter
      `L ${from.x} ${upY} ` + // go up
      `Q ${from.x} ${upY - curveRadius} ${from.x - curveRadius} ${
        upY - curveRadius
      } ` + // small curve to start left turn
      `L ${firstLeftX} ${upY - curveRadius} ` + // go left
      `L ${secondLeftX} ${upY - curveRadius} ` + // keep going left
      `Q ${secondLeftX - curveRadius} ${upY - curveRadius} ${
        secondLeftX - curveRadius
      } ${upY} ` + // smooth curve downward
      `L ${secondLeftX - curveRadius} ${to.y} ` + // go down
      `L ${to.x} ${to.y}` // final straight to home
    );
  };

  const solarEnd = { x: inverter.x, y: inverter.y - GAP };
  const batteryStart = { x: inverter.x, y: inverter.y + GAP + 6 };
  const homeEnd = { x: inverter.x - GAP, y: inverter.y };
  const gridStart = { x: inverter.x + GAP, y: inverter.y };

  const makePath = (from: { x: any; y: any }, to: { x: any; y: any }) =>
    `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

  const solarPath = makePath(solarPos, solarEnd);
  const batteryPath = makePath(batteryStart, batteryPos);
  const inverterShortened = { x: inverter.x - 5, y: inverter.y - 20 };
  const homePath = makeDoubleLeftTurnPath(
    inverterShortened,
    homePos,
    -8,
    25,
    60,
    100,
    10
  );

  const gridPath = makePath(gridStart, gridPos);

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Image source={Diagram} style={styles.image} resizeMode="contain" />

      {ready && (
        <Svg
          height={layout.height}
          width={layout.width}
          style={StyleSheet.absoluteFill}
        >
          <Defs>
            <Marker
              id="arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <Path d="M0,0 L6,3 L0,6 z" fill="#27ae60" />
            </Marker>
          </Defs>

          {/* ☀️ Solar → Inverter */}
          <AnimatedLinePath
            d={solarPath}
            active={solar > 0}
            direction="forward"
          />

          {/* 🔋 Inverter ↔ Battery */}
          <AnimatedLinePath
            d={batteryPath}
            active={batteryWatt > 0 && batteryStatus !== "ONHOLD"}
            direction={
              batteryStatus === "CHARGING"
                ? "forward"
                : batteryStatus === "DISCHARGING"
                ? "backward"
                : "forward"
            }
          />

          {/* 🏠 Inverter → Home */}
          <AnimatedLinePath
            d={homePath}
            active={home > 0}
            direction="forward"
          />

          {/* ⚡ Inverter ↔ Grid */}
          <AnimatedLinePath
            d={gridPath}
            active={grid !== 0}
            direction={grid > 0 ? "forward" : "backward"}
          />
        </Svg>
      )}

      {/* Labels */}
      <View style={[styles.label, { top: 10, left: 280 }]}>
        <Text style={styles.labelTitle}>Solar</Text>
        <Text style={styles.labelValue}>{solar} kW</Text>
      </View>

      <View style={[styles.label, { top: 220, left: 130 }]}>
        <Text style={styles.labelTitle}>Home</Text>
        <Text style={styles.labelValue}>{home} kW</Text>
      </View>

      <View style={[styles.label, { bottom: 20, left: 60 }]}>
        <Text style={styles.labelTitle}>Battery</Text>
        <Text style={styles.labelValue}>{battery} kW</Text>
      </View>

      <View style={[styles.label, { bottom: 20, right: 30 }]}>
        <Text style={styles.labelTitle}>Grid</Text>
        <Text style={styles.labelValue}>{grid} kW</Text>
      </View>
    </View>
  );
};

export default HouseDiagram;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 380,
    height: 340,
  },
  label: {
    position: "absolute",
    alignItems: "center",
  },
  labelTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "green",
  },
  labelValue: {
    fontSize: 12,
    color: "#555",
  },
});
