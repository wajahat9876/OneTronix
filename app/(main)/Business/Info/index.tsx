/* eslint-disable import/order */
import { useBusinessDetails } from "@/store/selectors/business/business";
import { pageTransitionAnimation } from "@src/constants/Animation";
import useCapitalizeFirstWord from "@src/hooks/useCapitalizeFirst";
import useCurrencyFlag from "@src/hooks/useCurrencyFlag";
import useExtractSortCode from "@src/hooks/useExtractSortCode";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import { hs, ms } from "@utils/design/design";
import { getRespValue } from "@utils/getRespValue";
import { useRouter } from "expo-router";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { Platform, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

const Info = () => {
  const { data: businessData } = useAppSelector(useBusinessDetails);

  const { capitalizeFirstWord } = useCapitalizeFirstWord();
  const { getCurrencyCode } = useCurrencyFlag();
  const { extractSortCode } = useExtractSortCode();
  // const { formatDate } = useFormatDate();
  const router = useRouter();

  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_money"
      style={{ flex: 1, backgroundColor: "white" }}
    >
      {/* <ScreenAuth
        title="Profile"
        style={{
          backgroundColor: Colors.light.theme.backgroundTopCurveSection,
        }}
        topColor={Colors.light.theme.backgroundTopCurveSection}
        bottomColor={Colors.light.theme.backgroundTopCurveSection}
        darkStatus
        appBarProps={{
          light: true,
          rightIcon: true,
        }}
        back={() => {
          router.replace('/(main)/Business/Home');
        }}
      > */}

      {/* </ScreenAuth> */}
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: hs(20),
    marginTop: 20,
  },
  iconPerson: {
    backgroundColor: "#e0e0e0",
    padding: ms(10),
    borderRadius: ms(100),
    width: "12%",
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    width: "92%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: Platform.OS === "ios" ? 2 : 0,
  },
  txt: {
    width: "60%",
    fontSize: getRespValue(16),
    fontWeight: "400",
    textAlign: "right",
  },
  subTitle: {
    width: "40%",
    fontSize: getRespValue(16),
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  divider: {
    borderBottomWidth: 0.5,
    marginTop: 10,
    opacity: 0.2,
  },
});

export default Info;
