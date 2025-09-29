import ArrowUp from "@assets/icons/arrow.png";
import GreenArrowDown from "@assets/icons/arrows.png";
import { ms } from "@utils/design/design";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Svg, { Line, Rect, Text as SvgText } from "react-native-svg";
type Props = {
  load?: number;
  solar?: number;
  battery?: number;
  grid?: number;
  height?: number;
  width?: number;
  type?: "Production" | "Consumption";
  totalValue: Number | 0;
  selectedTab: any;
  unit: string;
};

const RectangularChart: React.FC<Props> = ({
  load = 0,
  solar = 0,
  battery = 0,
  grid = 0,
  height = 115,
  width = 76,
  type,
  totalValue,
  selectedTab,
  unit,
}) => {
  const total = load + solar + battery + grid;

  if (total === 0) {
    return (
      <View style={styles.container}>
        <Text>No data available</Text>
      </View>
    );
  }

  const data = [
    {
      raw: battery,
      value: (battery / total) * 100,
      color: "#DCDCDD",
      label: type === "Consumption" ? "from Battery" : "to Battery",
      detail: `${battery} W`,
      textColor: "black",
    },
    {
      raw: grid,
      value: (grid / total) * 100,
      color: "#CDCDCE",
      label: type === "Consumption" ? "from Grid" : "to Grid",
      detail: `${grid} kWh`,
      textColor: "red",
    },
    {
      raw: load,
      value: (load / total) * 100,
      color: "#26C83F",
      label: "to Load",
      detail: `${load} Wh`,
      textColor: "white",
    },
    {
      raw: solar,
      value: (solar / total) * 100,
      color: "#FF5F57",
      label: type === "Consumption" ? "from Solar" : "to Solar",
      detail: `${solar} Wh`,
      textColor: "white",
    },
  ].filter((item) => item.raw && item.raw > 0);

  let offset = 0;
  const labels = ["Daily", "Monthly", "Yearly", "Net"];
  return (
    <View style={{ flex: 1 }}>
      {/* Text Summary */}
      <View style={{ alignSelf: "flex-start", marginLeft: 10 }}>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              fontFamily: "Ranade-Medium",
              fontSize: ms(33),
              lineHeight: ms(38),
            }}
          >
            {Number(totalValue || 0.0).toFixed(0)}
          </Text>
          <Text
            style={{
              fontFamily: "Ranade-Medium",
              fontSize: ms(13),
              marginTop: 20,
              marginLeft: 5,
              color: "#5F5F60",
            }}
          >
            {unit}
          </Text>
        </View>
        <Text style={styles.txtProduction}>
          {`${labels[selectedTab]} ${type}`}
        </Text>
      </View>
      {/* Main content  */}
      <View style={styles.container}>
        {/* ✅ Bar with % inside */}
        <View style={{ borderRadius: 10, overflow: "hidden", height, width }}>
          <Svg height={height} width={width}>
            {data.map((item, index) => {
              const rectHeight = (item.value / 100) * height;
              const y = offset;
              const midY = y + rectHeight / 2;
              offset += rectHeight;

              return (
                <React.Fragment key={index}>
                  {/* Slice */}
                  <Rect
                    x={0}
                    y={y}
                    width={width}
                    height={rectHeight}
                    fill={item.color}
                  />

                  {/* % inside slice */}
                  {rectHeight > 10 && (
                    <>
                      {/* Number */}
                      <SvgText
                        x={width / 2}
                        y={midY + 2}
                        fontFamily="Ranade-Medium"
                        fontSize={Math.max(8, Math.min(10, rectHeight * 0.4))}
                        fill={item.textColor}
                        textAnchor="middle" // center everything
                        fontWeight="bold"
                      >
                        {item.value.toFixed(1)}
                      </SvgText>

                      {/* % symbol right next to it */}
                      <SvgText
                        x={width / 2}
                        y={midY + 2}
                        dx={18} // ✅ horizontal offset, tweak until it looks perfect
                        fontFamily="Ranade-Medium"
                        fontSize={Math.max(7, Math.min(9, rectHeight * 0.35))}
                        fill={item.textColor}
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        %
                      </SvgText>
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </Svg>
        </View>

        {/* ✅ Lines at slice boundaries */}
        <Svg
          height={height}
          width={15}
          style={{ position: "absolute", left: width }}
        >
          {(() => {
            let offset2 = 0;
            return data.map((item, index) => {
              const rectHeight = (item.value / 100) * height;
              const startY = offset2;
              const endY = startY + rectHeight;
              const midY = startY + rectHeight / 2;
              offset2 += rectHeight;

              return (
                <Line
                  key={index}
                  x1={0}
                  y1={midY} // ✅ bottom of slice
                  x2={20}
                  y2={midY}
                  stroke={"gray"}
                  strokeWidth={0.8}
                />
              );
            });
          })()}
        </Svg>

        {/* ✅ External Labels with ↓ arrow */}
        <View style={[StyleSheet.absoluteFill, { left: width + 22 }]}>
          {(() => {
            let offset3 = 0;
            return data.map((item, index) => {
              const rectHeight = (item.value / 100) * height;
              const y = offset3;
              const midY = y + rectHeight / 2;
              offset3 += rectHeight;

              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    position: "absolute",
                    left: -8,
                    top: midY - 25, // center block
                  }}
                >
                  {/* Arrow */}

                  <Image
                    source={type === "Consumption" ? ArrowUp : GreenArrowDown}
                    style={{ width: 12, height: 12, marginRight: 6 }}
                    resizeMode="contain"
                  />

                  {/* Texts stacked (value + label) */}
                  <View style={{ flexDirection: "column" }}>
                    <Text
                      style={{
                        fontSize: 9,
                        color: "black",
                        fontWeight: "600",
                        marginBottom: 2,
                        fontFamily: "Ranade-Medium",
                      }}
                    >
                      {item.detail}
                    </Text>
                    <Text
                      style={{
                        fontSize: 9,
                        color: "#818283",
                        fontWeight: "600",
                        fontFamily: "Excon-medium",
                      }}
                    >
                      {item.label}
                    </Text>
                  </View>
                </View>
              );
            });
          })()}
        </View>
      </View>
    </View>
  );
};

export default RectangularChart;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 20,
    marginHorizontal: 10,
  },
  txtProduction: {
    fontSize: 13,
    fontFamily: "Excon-Regular",
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
    // alignSelf: "center",s
  },
});
