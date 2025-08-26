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

  useEffect(() => {
    if (active) {
      const toVal = direction === "forward" ? -200 : 200;
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
    <AnimatedPath
      d={d}
      stroke={color}
      strokeWidth={3}
      fill="none"
      strokeDasharray="8,6"
      strokeDashoffset={dashOffset}
      opacity={active ? 1 : 0.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      // Optional: arrow markers if you want (commented below if not needed)
    />
  );
};

const FlowDiagram = ({
  solar = 0,
  grid = 0,
  consumption = 0,
  battery = 0,
  batteryFlow = 0,
}) => {
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const iconSize = 50;
  const topOffset = 20;
  const bottomOffset = 60;

  const onLayout = (e) => {
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
    x: 40 + iconSize / 2,
    y: ready ? layout.height - bottomOffset - iconSize / 2 : 300,
  };
  const gridPos = {
    x: centerX,
    y: ready ? layout.height - bottomOffset - iconSize / 2 : 300,
  };
  const loadPos = {
    x: ready ? layout.width - 40 - iconSize / 2 : 320,
    y: ready ? layout.height - bottomOffset - iconSize / 2 : 300,
  };
  const inverterPos = {
    x: centerX,
    y: ready && (solarPos.y + gridPos.y) / 2,
  };
  // slightly offset endpoints so line doesn't go under icon center
  const bump = (pt, dirX = 0, dirY = 0, amount = 18) => ({
    x: pt.x + dirX * amount,
    y: pt.y + dirY * amount,
  });

  // from/to points for nicer connection (so line ends near icon edge not at exact center)
  const solarTo = bump(inverterPos, 0, -1, 28); // end above inverter
  const solarFrom = bump(solarPos, 0, 1, 18); // start below solar icon

  const invToBattery = bump(batteryPos, 0, -2, 10); // slightly above battery center
  const invToGrid = bump(gridPos, 0, -1, 10);
  const invToLoad = bump(loadPos, 0, -1, 10);
  const invFrom = bump(inverterPos, 0, 0, 0);

  // build path strings (pixel values)
  const pathSolar = makeStraight(solarFrom, solarTo); // vertical-ish
  const pathBattery = makeElbowLeft(invFrom, invToBattery, 40); // inverter -> left then down -> battery
  const pathGrid = makeStraight(invFrom, invToGrid); // straight down
  const pathLoad = makeElbowRight(invFrom, invToLoad, 40); // inverter -> right then down -> load

  return (
    <View style={styles.wrapper}>
      <View style={styles.container} onLayout={onLayout}>
        {ready && (
          <>
            {/* Icons (absolute, using computed centers) */}
            <Image
              source={{
                uri: "https://img.icons8.com/ios-filled/100/solar-panel.png",
              }}
              style={[
                styles.icon,
                {
                  left: solarPos.x - iconSize / 2,
                  top: solarPos.y - iconSize / 2,
                },
              ]}
            />
            <Text
              style={[
                styles.label,
                { left: solarPos.x - 40, top: solarPos.y + iconSize / 2 + 6 },
              ]}
            >
              Solar {solar}w
            </Text>

            <Image
              source={{
                uri: "https://img.icons8.com/ios-filled/100/server.png",
              }}
              style={[
                styles.icon,
                {
                  left: inverterPos.x - iconSize / 2,
                  top: inverterPos.y - iconSize / 2,
                },
              ]}
            />
            <Text
              style={[
                styles.label,
                {
                  left: inverterPos.x - 35,
                  top: inverterPos.y + iconSize / 2 + 6,
                },
              ]}
            >
              Inverter
            </Text>

            <Image
              source={{
                uri: "https://img.icons8.com/ios-filled/100/battery.png",
              }}
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
              Battery {battery}%
            </Text>

            <Image
              source={{
                uri: "https://img.icons8.com/ios-filled/100/transmission-tower.png",
              }}
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
              Grid {grid}w
            </Text>

            <Image
              source={{ uri: "https://img.icons8.com/ios-filled/100/home.png" }}
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
              Load {consumption}w
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
                color="gray"
                active={solar > 0}
                direction="forward"
              />

              {/* Inverter -> Battery (elbow left) */}
              <AnimatedLinePath
                d={pathBattery}
                color="#2ecc71"
                active={batteryFlow !== 0}
                direction={batteryFlow > 0 ? "forward" : "backward"}
              />

              {/* Inverter -> Grid */}
              <AnimatedLinePath
                d={pathGrid}
                color="#3498db"
                active={grid !== 0}
                direction={grid > 0 ? "forward" : "backward"}
              />

              {/* Inverter -> Load (elbow right) */}
              <AnimatedLinePath
                d={pathLoad}
                color="#e74c3c"
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
    height: 420,
    backgroundColor: "white",
    position: "relative",
  },
  icon: {
    position: "absolute",
    width: 50,
    height: 50,
    resizeMode: "contain",
    tintColor: "#444",
  },
  label: {
    position: "absolute",
    fontSize: 13,
    width: 80,
    textAlign: "center",
  },
});

export default FlowDiagram;
