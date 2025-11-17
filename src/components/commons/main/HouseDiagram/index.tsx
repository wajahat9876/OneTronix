import { useBusinessDetails } from "@/store/selectors/business/business";
import DiagramDark from "@assets/icons/darkHouse.png";
import Diagram from "@assets/icons/diagram.png";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { ms } from "@utils/design/design";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
interface HouseDiagramProps {
  solar?: number; // kW
  home?: number; // kW
  grid?: number; // kW (+ve import, -ve export)
  battery?: number; // kW
  batteryStatus?: "CHARGING" | "DISCHARGING" | "ONHOLD";
  batteryWatt?: number; // current battery watt
  gridDirection?: "forward" | "backward";
  gridStatus?: "IMPORT" | "EXPORT" | "STANDBY";
}
// --- Responsive helpers ---
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BASE_WIDTH = 390;
const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

// --- Animated Line Path Component ---
const AnimatedPath = Animated.createAnimatedComponent(Path);

const AnimatedLinePath = ({
  d,
  color = "#04B9F5",
  active = false,
  direction = "forward",
  strokeDasharray = "120,80",
}) => {
  const dashOffset = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

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
      return () => animRef.current?.stop();
    } else {
      animRef.current?.stop();
      dashOffset.stopAnimation(() => dashOffset.setValue(0));
    }
  }, [active, direction]);

  return (
    <>
      <Path
        d={d}
        stroke="#0D111E"
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
      />
      <AnimatedPath
        d={d}
        stroke={color}
        strokeWidth={1}
        fill="none"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={dashOffset}
        opacity={active ? 1 : 0}
        strokeLinecap="round"
      />
    </>
  );
};

// --- Main Diagram ---

const HouseDiagram = (props: HouseDiagramProps) => {
  const {
    solar = 0,
    home = 0,
    grid = 0,
    battery = 0,
    batteryStatus = "ONHOLD",
    batteryWatt = 0,
    gridDirection = "forward",
    gridStatus = "STANDBY",
  } = props;
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const { isDarkMode } = useAppSelector(useBusinessDetails);
  const onLayout = (e: any) => setLayout(e.nativeEvent.layout);
  const textColor = isDarkMode ? "white" : "black";
  const labelColor = isDarkMode ? "white" : "#555";

  const ready = layout.width > 0 && layout.height > 0;
  const original = {
    inverter: { x: 260, y: 160 },
    solarPos: { x: 260, y: 110 },
    batteryPos: { x: 260, y: 200 },
    gridPos: { x: 270, y: 260 },
    homePos: { x: 117, y: 150 },
    image: { width: 390, height: 352 },
  };

  // proportional scaling based on width
  const scaleX = (x: number) => (x / original.image.width) * layout.width;
  const scaleY = (y: number) =>
    (y / original.image.height) *
    (layout.width / (original.image.width / original.image.height));

  const inverter = {
    x: scaleX(original.inverter.x),
    y: scaleY(original.inverter.y),
  };
  const solarPos = {
    x: scaleX(original.solarPos.x + 20),
    y: scaleY(original.solarPos.y),
  };
  const batteryPos = {
    x: scaleX(original.batteryPos.x),
    y: scaleY(original.batteryPos.y),
  };
  const gridPos = {
    x: scaleX(original.gridPos.x),
    y: scaleY(original.gridPos.y),
  };
  const homePos = {
    x: scaleX(original.homePos.x),
    y: scaleY(original.homePos.y),
  };

  const GAP = scale(18);
  const elbowLength = scale(60);

  const makePath = (from: any, to: any) =>
    `M ${from.x + 15} ${from.y} L ${to.x + 15} ${to.y}`;

  const makeDoubleLeftTurnPath = (from: any, to: any) => {
    const upY = from.y - scale(1);
    const firstLeftX = from.x - scale(65);
    const secondLeftX = from.x - scale(140);
    const curveRadius = scale(8);

    return (
      `M ${from.x} ${from.y - 2} ` +
      `L ${from.x} ${upY - scale(7)} ` +
      `Q ${from.x} ${upY - curveRadius} ${from.x - curveRadius} ${
        upY - curveRadius
      } ` +
      `L ${firstLeftX} ${upY - curveRadius} ` +
      `L ${secondLeftX} ${upY - curveRadius} ` +
      `Q ${secondLeftX - curveRadius + scale(7)} ${upY - curveRadius} ${
        secondLeftX - curveRadius
      } ${upY} ` +
      `L ${secondLeftX - curveRadius} ${to.y} L ${to.x} ${to.y}`
    );
  };

  const solarEnd = { x: inverter.x, y: inverter.y - GAP };
  const batteryStart = { x: inverter.x, y: inverter.y + GAP + scale(6) };
  const inverterShortened = {
    x: inverter.x + scale(5),
    y: inverter.y - scale(10),
  };
  const homeEnd = { x: inverter.x - GAP, y: inverter.y - scale(15) };
  const homeMidPoint = { x: homeEnd.x - elbowLength / 6 + 20, y: homeEnd.y };

  const batteryPath = makePath(batteryStart, batteryPos);
  const homePath = makeDoubleLeftTurnPath(inverterShortened, homePos);

  const totalY = gridPos.y - homeMidPoint.y;
  const bendStartY = homeMidPoint.y + totalY * 0.38;
  const bendDepth = scale(35);
  const gridPath = `
    M ${homeMidPoint.x} ${homeMidPoint.y - scale(4)}
    C ${homeMidPoint.x} ${bendStartY + scale(40)},
      ${homeMidPoint.x} ${bendStartY + bendDepth / 1.8},
      ${homeMidPoint.x} ${bendStartY + bendDepth}
    S ${homeMidPoint.x} ${bendStartY + bendDepth + scale(10)},
      ${gridPos.x} ${gridPos.y}
  `;

  const curveDepth = scale(10);
  const curveY = solarPos.y - curveDepth;
  const solarPath = `M ${solarEnd.x + 20} ${solarEnd.y + scale(3)} Q ${
    solarEnd.x + scale(25)
  } ${curveY + scale(10)}, ${solarPos.x - scale(5)} ${solarPos.y - scale(2)}`;

  return (
    <View style={styles.container} onLayout={onLayout}>
      {isDarkMode ? (
        <Image
          source={DiagramDark}
          style={{
            width: layout.width + 40 || scale(440),
            height:
              (layout.width / original.image.width) * original.image.height,
          }}
          resizeMode="contain"
        />
      ) : (
        <Image
          source={Diagram}
          style={{
            width: layout.width + 40 || scale(440),
            height:
              (layout.width / original.image.width) * original.image.height,
          }}
          resizeMode="contain"
        />
      )}

      {ready && (
        <Svg
          height={layout.height}
          width={layout.width}
          style={StyleSheet.absoluteFill}
        >
          <AnimatedLinePath
            d={solarPath}
            active={solar > 0}
            direction="backward"
            strokeDasharray="30,70"
          />
          <Circle
            cx={solarPos.x - scale(5)}
            cy={solarPos.y - scale(2)}
            r={3}
            fill="#05B1F2"
          />

          <AnimatedLinePath
            d={batteryPath}
            active={batteryWatt > 0 && batteryStatus !== "ONHOLD"}
            strokeDasharray="20,80"
            direction={
              batteryStatus === "CHARGING"
                ? "forward"
                : batteryStatus === "DISCHARGING"
                ? "backward"
                : "forward"
            }
          />

          <AnimatedLinePath
            d={homePath}
            active={home > 0}
            direction="forward"
          />

          <Circle cx={homePos.x} cy={homePos.y} r={3} fill="#04B9F5" />

          <AnimatedLinePath
            d={gridPath}
            active={grid !== 0 && gridStatus !== "STANDBY"}
            direction={gridDirection === "forward" ? "backward" : "forward"}
          />
          <Circle
            cx={homeMidPoint.x}
            cy={homeMidPoint.y - scale(4)}
            r={2.3}
            stroke="white"
            strokeWidth={1.5}
            fill="transparent"
          />
          <Circle cx={gridPos.x + 1} cy={gridPos.y + 1} r={3} fill="#05B1F2" />
        </Svg>
      )}

      {/* Labels */}
      <View style={[styles.label, { top: scale(28), left: scale(290) }]}>
        <Text style={[styles.labelTitle, { color: textColor }]}>Solar</Text>
        <Text style={[styles.labelValue, { color: labelColor }]}>
          {solar} kW
        </Text>
      </View>
      <View style={[styles.label, { top: scale(115), left: scale(78) }]}>
        <Text style={[styles.labelTitle, { color: textColor }]}>Home</Text>
        <Text style={[styles.labelValue, { color: labelColor }]}>
          {home} kW
        </Text>
      </View>
      <View style={[styles.label, { bottom: scale(135), right: scale(55) }]}>
        <Text style={[styles.labelTitle, { color: textColor }]}>Battery</Text>
        <Text style={[styles.labelValue, { color: labelColor }]}>
          {battery} kW
        </Text>
      </View>
      <View style={[styles.label, { bottom: scale(60), right: scale(130) }]}>
        <Text style={[styles.labelTitle, { color: textColor }]}>Grid</Text>
        <Text style={[styles.labelValue, { color: labelColor }]}>
          {grid} kW
        </Text>
      </View>
    </View>
  );
};

export default HouseDiagram;

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
  label: { position: "absolute", alignItems: "center" },
  labelTitle: {
    fontSize: ms(11),
    fontWeight: "600",
    fontFamily: "Excon-Regular",
  },
  labelValue: { fontSize: ms(9), fontFamily: "Excon-Regular" },
});
