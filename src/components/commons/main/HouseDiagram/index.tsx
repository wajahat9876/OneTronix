import Diagram from "@assets/icons/diagram.png";
import { hs, vs } from "@utils/design/design";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import Svg, { Defs, Marker, Path } from "react-native-svg";

// --- Animated Line Path Component ---
const AnimatedPath = Animated.createAnimatedComponent(Path);

const AnimatedLinePath = ({
  d,
  color = "green",
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
        stroke="#0D111E"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />

      {/* Animated flowing line */}
      <AnimatedPath
        d={d}
        stroke={color}
        strokeWidth={1}
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
  const gridPos = { x: 300, y: 250 };
  const homePos = { x: 120, y: 149 };

  const GAP = 18; // simple fixed pixel offset from inverter
  const makeElbowLeft = (
    from: { x: number; y: number },
    to: { x: number; y: number },
    elbowLength = 60,
    curveRadius = 20
  ) => {
    // how far to go left from inverter before turning
    const elbowX = from.x - elbowLength;

    return (
      `M ${from.x} ${from.y} ` + // start at inverter
      `L ${elbowX} ${from.y} ` + // go left
      `Q ${elbowX - curveRadius} ${from.y} ${elbowX - curveRadius} ${
        from.y + curveRadius
      } ` + // make a rounded left-down turn
      `L ${elbowX - curveRadius} ${to.y} ` + // straight down after the curve
      `L ${to.x} ${to.y}` // finally to the battery
    );
  };
  const elbowLength = 70;

  const solarEnd = { x: inverter.x, y: inverter.y - GAP };
  const batteryStart = { x: inverter.x, y: inverter.y + GAP + 6 };
  const homeEnd = { x: inverter.x - GAP, y: inverter.y - 15 };
  // const gridStart = { x: inverter.x + GAP, y: inverter.y };
  const homeMidPoint = {
    x: homeEnd.x - elbowLength / 2, // half the elbow distance from the home line start
    y: homeEnd.y, // same y as home line start
  };
  const makePath = (from: { x: any; y: any }, to: { x: any; y: any }) =>
    `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

  // const solarPath = makePath(solarPos, solarEnd);
  const batteryPath = makePath(batteryStart, batteryPos);
  const homePath = makeElbowLeft(homeEnd, homePos, 110, 12);
  // const gridPath = `M ${homeMidPoint.x} ${homeMidPoint.y} L ${homeMidPoint.x} ${gridPos.y}`;
  const totalY = gridPos.y - homeMidPoint.y;
  const bendStartY = homeMidPoint.y + totalY * 0.78; // 70% point
  const bendDepth = 40; // how deep the curve bends (adjust this)
  const bendMidY = bendStartY + bendDepth / 2;

  // Build the multi-segment path
  const gridPath = `
  M ${homeMidPoint.x} ${homeMidPoint.y}
  L ${homeMidPoint.x} ${bendStartY}
  Q ${homeMidPoint.x + 40} ${bendMidY}, ${homeMidPoint.x + 80} ${
    bendStartY + bendDepth
  }
  L ${gridPos.x - 10} ${gridPos.y + 18}
`;

  //solar curve
  const curveDepth = 10; // how much to bend
  const curveY = solarPos.y - curveDepth;

  const solarPath = `
  M ${solarEnd.x} ${solarEnd.y}
  Q ${solarEnd.x + 5} ${curveY + 10}, ${solarPos.x - 5} ${solarPos.y - 2}
`;

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
      <View style={[styles.label, { top: vs(35), left: hs(270) }]}>
        <Text style={styles.labelTitle}>Solar</Text>
        <Text style={styles.labelValue}>{solar} kW</Text>
      </View>

      <View style={[styles.label, { top: vs(130), left: hs(65) }]}>
        <Text style={styles.labelTitle}>Home</Text>
        <Text style={styles.labelValue}>{home} kW</Text>
      </View>

      <View style={[styles.label, { bottom: vs(155), left: hs(280) }]}>
        <Text style={styles.labelTitle}>Battery</Text>
        <Text style={styles.labelValue}>{battery} kW</Text>
      </View>

      <View style={[styles.label, { bottom: vs(70), right: hs(140) }]}>
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
    color: "black",
  },
  labelValue: {
    fontSize: 12,
    color: "#555",
  },
});
