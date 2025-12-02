/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
import { useBusinessDetails } from "@/store/selectors/business/business";
import IconPerson from "@assets/icons/MenuIcons/profile.png";
import InfoRow from "@src/components/commons/InfoRow";
import ScreenAuth from "@src/components/globals/ScreenAuth";
import { ScrollView } from "@src/components/libraries";
import { pageTransitionAnimation } from "@src/constants/Animation";
import Colors from "@src/constants/Colors";
import useCapitalizeFirstWord from "@src/hooks/useCapitalizeFirst";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
import { hs, ms, vs } from "@utils/design/design";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSelector } from "react-redux";
const CreateAccount = ({ back }: MultiStepFormProps) => {
  const { data: businessData } = useSelector(useBusinessDetails);
  const { capitalizeFirstWord } = useCapitalizeFirstWord();
  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_money"
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <ScreenAuth
        title="Profile"
        style={{
          backgroundColor: "white",
        }}
        topColor={"white"}
        bottomColor={Colors.light.theme.backgroundTopCurveSection}
        darkStatus
        appBarProps={{
          light: true,
          rightIcon: true,
        }}
        back={() => back?.()}
      >
        <View style={styles.card}>
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                marginVertical: vs(20),
                alignItems: "center",
              }}
            >
              <View style={styles.iconPerson}>
                <Image source={IconPerson} style={{ width: 30, height: 30 }} />
              </View>
              <Text
                style={{
                  marginLeft: vs(10),
                  fontFamily: "Excon-Medium",
                  color: "black",
                }}
              >
                {capitalizeFirstWord(businessData?.firstName)}
              </Text>
            </View>

            <View style={styles.container}>
              {businessData?.firstName && (
                <InfoRow
                  label="First Name"
                  value={`${capitalizeFirstWord(businessData?.firstName)} `}
                />
              )}
              {businessData?.lastName && (
                <InfoRow
                  label="Last Name"
                  value={`${capitalizeFirstWord(businessData?.lastName)} `}
                />
              )}

              {businessData?.email && (
                <InfoRow label="Email" value={businessData?.email} />
              )}

              <InfoRow label="Country" value={"Pakistan"} />
            </View>
          </ScrollView>
        </View>
      </ScreenAuth>
    </Animated.View>
  );
};

export default CreateAccount;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: hs(20),
    paddingRight: hs(20),
    marginTop: vs(10),
  },
  iconPerson: {
    borderRadius: ms(20),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: hs(20),
  },
  card: {
    alignSelf: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 5,
    width: "92%",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: Platform.OS === "ios" ? 2 : 2,
    marginBottom: 10,
    paddingBottom: 50,
  },
  currentBalanceContainer: {
    alignItems: "center",
    backgroundColor: Colors.light.theme.backgroundColorCurrentBalanceContainer,
    borderRadius: ms(24),
    marginTop: vs(16),
    paddingTop: vs(16),
    paddingBottom: vs(16),
    paddingLeft: hs(56),
    paddingRight: hs(56),
  },
});
