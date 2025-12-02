import Logo from "@assets/eccLogo/oneTronixLogo.svg";
import { hs, ms, vs } from "@utils/design/design";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

type Props = {
  align?: "left" | "right" | "center"; // control alignment
  showLogo?: boolean; // optional, hide/show logo
  style?: object; // extra styles if needed
};

const OneTronixBrand: React.FC<Props> = ({
  align = "right",
  showLogo = true,
  style,
}) => {
  const alignStyle: ViewStyle =
    align === "right"
      ? { alignItems: "flex-end" }
      : align === "center"
      ? { alignItems: "center" }
      : { alignItems: "flex-start" };

  return (
    <View style={[styles.container, style]}>
      {showLogo && (
        <View style={[styles.logoContainer, alignStyle]}>
          <Logo />
        </View>
      )}
      <View style={[styles.textContainer]}>
        <Text style={styles.one}>ONE</Text>
        <Text style={styles.tronix}>TRONIX</Text>
        <Text style={styles.partner}>TECHNOLOGY PARTNER</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: vs(26),
  },
  logoContainer: {
    alignSelf: "flex-end",
    padding: hs(16),
  },
  textContainer: {
    marginTop: vs(32),
  },
  one: {
    color: "red",
    fontSize: ms(40),
    lineHeight: 45,
    fontFamily: "Excon-Black",
  },
  tronix: {
    color: "red",
    fontSize: ms(44),
    fontFamily: "Excon-Regular",
    lineHeight: 45,
    marginTop: -4,
  },
  partner: {
    color: "white",
    fontSize: ms(13),
    fontFamily: "Excon-Regular",
    letterSpacing: 1,
    lineHeight: 18,
    marginTop: -5,
  },
});

export default OneTronixBrand;
