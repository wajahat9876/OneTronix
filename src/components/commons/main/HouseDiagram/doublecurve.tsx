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
//Responsive Code
// import DiagramDark from "@assets/icons/darkHouse.png";
// import Diagram from "@assets/icons/diagram.png";
// import React, { useEffect, useRef, useState } from "react";
// import { Animated, Image, StyleSheet, Text, View } from "react-native";
// import Svg, { Circle, Defs, Marker, Path } from "react-native-svg";

// // --- Animated Line Path Component ---
// const AnimatedPath = Animated.createAnimatedComponent(Path);

// const AnimatedLinePath = ({
//   d,
//   color = "#04B9F5",
//   active = false,
//   direction = "forward",
//   strokeDasharray = "120,80",
// }) => {
//   const dashOffset = useRef(new Animated.Value(0)).current;
//   const animRef = useRef<Animated.CompositeAnimation | null>(null);

//   useEffect(() => {
//     if (active) {
//       const toVal = direction === "forward" ? -400 : 400;

//       animRef.current = Animated.loop(
//         Animated.timing(dashOffset, {
//           toValue: toVal,
//           duration: 4000,
//           useNativeDriver: false,
//         })
//       );

//       animRef.current.start();

//       return () => animRef.current?.stop();
//     } else {
//       animRef.current?.stop();
//       dashOffset.stopAnimation(() => dashOffset.setValue(0));
//     }
//   }, [active, direction]);

//   return (
//     <>
//       <Path
//         d={d}
//         stroke="#0D111E"
//         strokeWidth={3}
//         fill="none"
//         strokeLinecap="round"
//       />
//       <AnimatedPath
//         d={d}
//         stroke={color}
//         strokeWidth={1.5}
//         fill="none"
//         strokeDasharray={strokeDasharray}
//         strokeDashoffset={dashOffset}
//         opacity={active ? 1 : 0}
//         strokeLinecap="round"
//       />
//     </>
//   );
// };

// // --- Main Diagram Component ---
// interface HouseDiagramProps {
//   solar?: number;
//   home?: number;
//   grid?: number;
//   battery?: number;
//   batteryStatus?: "CHARGING" | "DISCHARGING" | "ONHOLD";
//   batteryWatt?: number;
//   schema?: "light" | "dark";
// }

// const HouseDiagram = (props: HouseDiagramProps) => {
//   const {
//     solar = 0,
//     home = 0,
//     grid = 0,
//     battery = 0,
//     batteryStatus = "ONHOLD",
//     batteryWatt = 0,
//     schema,
//   } = props;

//   const [layout, setLayout] = useState({ width: 0, height: 0 });
//   const isDark = schema === "dark";
//   const textColor = isDark ? "white" : "black";

//   const onLayout = (e: any) => {
//     const { width, height } = e.nativeEvent.layout;
//     setLayout({ width, height });
//   };

//   const ready = layout.width > 0 && layout.height > 0;

//   // 🔹 Normalized coordinates (0–1 range)
//   const inverter = { x: 0.68, y: 0.47 };
//   const solarPos = { x: 0.68, y: 0.32 };
//   const batteryPos = { x: 0.68, y: 0.58 };
//   const gridPos = { x: 0.62, y: 0.72 };
//   const homePos = { x: 0.31, y: 0.44 };

//   const scale = (pos: { x: number; y: number }) => ({
//     x: pos.x * layout.width,
//     y: pos.y * layout.height,
//   });

//   const inverterPx = scale(inverter);
//   const solarPx = scale(solarPos);
//   const batteryPx = scale(batteryPos);
//   const gridPx = scale(gridPos);
//   const homePx = scale(homePos);

//   const GAP = layout.height * 0.05;

//   // 🔹 Paths
//   const makePath = (from: any, to: any) =>
//     `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

//   const solarEnd = { x: inverterPx.x, y: inverterPx.y - GAP };
//   const batteryStart = { x: inverterPx.x, y: inverterPx.y + GAP };

//   const batteryPath = makePath(batteryStart, batteryPx);

//   // solar curved path
//   const curveDepth = layout.height * 0.04;
//   const curveY = solarPx.y - curveDepth;
//   const solarPath = `
//     M ${solarEnd.x} ${solarEnd.y + 2}
//     Q ${solarEnd.x + 10} ${curveY}, ${solarPx.x - 5} ${solarPx.y - 2}
//   `;

//   // inverter → home
//   // inverter → home (elbow double left turn)
//   const homePath = `
//   M ${inverterPx.x - 5} ${inverterPx.y - 10}
//   L ${inverterPx.x - layout.width * 0.1} ${inverterPx.y - 10}
//   L ${inverterPx.x - layout.width * 0.1} ${homePx.y}
//   L ${homePx.x } ${homePx.y}
// `;

//   // const homePath = `
//   //   M ${inverterPx.x - 5} ${inverterPx.y - 10}
//   //   C ${inverterPx.x - layout.width * 0.12} ${
//   //   inverterPx.y - layout.height * 0.1
//   // },
//   //     ${inverterPx.x - layout.width * 0.25} ${
//   //   inverterPx.y - layout.height * 0.08
//   // },
//   //     ${homePx.x} ${homePx.y}
//   // `;

//   // inverter → grid curve
//   const gridPath = `
//     M ${inverterPx.x - layout.width * 0.08} ${
//     inverterPx.y - layout.height * 0.03
//   }
//     C ${inverterPx.x - layout.width * 0.08} ${
//     inverterPx.y + layout.height * 0.15
//   },
//       ${gridPx.x + layout.width * 0.05} ${gridPx.y - layout.height * 0.05},
//       ${gridPx.x} ${gridPx.y}
//   `;

//   return (
//     <View style={styles.container} onLayout={onLayout}>
//       {/* Background image */}
//       <Image
//         source={isDark ? DiagramDark : Diagram}
//         style={[styles.image, { width: "100%", height: "100%" }]}
//         resizeMode="contain"
//       />

//       {ready && (
//         <Svg
//           height={layout.height}
//           width={layout.width}
//           style={StyleSheet.absoluteFill}
//         >
//           <Defs>
//             <Marker
//               id="arrow"
//               markerWidth="8"
//               markerHeight="8"
//               refX="6"
//               refY="3"
//               orient="auto"
//               markerUnits="strokeWidth"
//             >
//               <Path d="M0,0 L6,3 L0,6 z" fill="#27ae60" />
//             </Marker>
//           </Defs>

//           {/* ☀️ Solar → Inverter */}
//           <AnimatedLinePath
//             d={solarPath}
//             active={solar > 0}
//             direction="backward"
//             strokeDasharray="30,70"
//           />
//           <Circle
//             cx={solarPx.x - 5}
//             cy={solarPx.y - 2}
//             r={3}
//             fill={solar > 0 ? "#05B1F2" : "#05B1F2"}
//           />

//           {/* 🔋 Inverter ↔ Battery */}
//           <AnimatedLinePath
//             d={batteryPath}
//             active={batteryWatt > 0 && batteryStatus !== "ONHOLD"}
//             strokeDasharray="20,80"
//             direction={
//               batteryStatus === "CHARGING"
//                 ? "forward"
//                 : batteryStatus === "DISCHARGING"
//                 ? "backward"
//                 : "forward"
//             }
//           />

//           {/* 🏠 Inverter → Home */}
//           <AnimatedLinePath
//             d={homePath}
//             active={home > 0}
//             direction="forward"
//           />
//           <Circle
//             cx={homePx.x}
//             cy={homePx.y}
//             r={3}
//             fill={home > 0 ? "#04B9F5" : "#05B1F2"}
//           />

//           {/* ⚡ Inverter ↔ Grid */}
//           <AnimatedLinePath
//             d={gridPath}
//             active={grid !== 0}
//             direction={grid > 0 ? "forward" : "backward"}
//           />
//           <Circle
//             cx={gridPx.x}
//             cy={gridPx.y}
//             r={3}
//             fill={grid !== 0 ? "#05B1F2" : "#05B1F2"}
//           />
//         </Svg>
//       )}

//       {/* Labels */}
//       <View
//         style={[
//           styles.label,
//           { top: layout.height * 0.08, left: layout.width * 0.73 },
//         ]}
//       >
//         <Text style={[styles.labelTitle, { color: textColor }]}>Solar</Text>
//         <Text style={styles.labelValue}>{solar} kW</Text>
//       </View>

//       <View
//         style={[
//           styles.label,
//           { top: layout.height * 0.37, left: layout.width * 0.17 },
//         ]}
//       >
//         <Text style={[styles.labelTitle, { color: textColor }]}>Home</Text>
//         <Text style={styles.labelValue}>{home} kW</Text>
//       </View>

//       <View
//         style={[
//           styles.label,
//           { top: layout.height * 0.58, left: layout.width * 0.73 },
//         ]}
//       >
//         <Text style={[styles.labelTitle, { color: textColor }]}>Battery</Text>
//         <Text style={styles.labelValue}>{battery} kW</Text>
//       </View>

//       <View
//         style={[
//           styles.label,
//           { top: layout.height * 0.72, left: layout.width * 0.55 },
//         ]}
//       >
//         <Text style={[styles.labelTitle, { color: textColor }]}>Grid</Text>
//         <Text style={styles.labelValue}>{grid} kW</Text>
//       </View>
//     </View>
//   );
// };

// export default HouseDiagram;

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     justifyContent: "center",
//     width: "100%",
//     aspectRatio: 1.1, // Keeps proportional shape
//   },
//   image: {
//     position: "absolute",
//   },
//   label: {
//     position: "absolute",
//     alignItems: "center",
//   },
//   labelTitle: {
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   labelValue: {
//     fontSize: 12,
//     color: "#555",
//   },
// });
