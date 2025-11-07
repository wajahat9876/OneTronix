import { TouchableOpacity } from "@src/components/libraries";
import Colors from "@src/constants/Colors";
import { hs, ms, vs } from "@utils/design/design";
import { Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { IButtonProps } from "./types";

const Button = ({
  btnTitle,
  btnColor = Colors.light.theme.black,
  btnTitleColor = Colors.light.theme.white,
  loading = false,
  loaderColor = Colors.light.theme.white,
  onClick,
  disabled = false,
  opacitys,
}: IButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled}
      //   className="w-full items-center py-4 rounded-xl"
      style={{
        // width: '100%',
        alignItems: "center",
        backgroundColor: btnColor,
        borderRadius: ms(10),
        paddingTop: vs(16),
        paddingBottom: vs(16),
        paddingLeft: hs(32),
        paddingRight: hs(32),
        opacity: 1,
      }}
    >
      {loading ? (
        <View className="flex items-center justify-center">
          <ActivityIndicator size="small" color={loaderColor} />
        </View>
      ) : (
        <Text
          style={{ color: disabled ? "gray" : btnTitleColor, fontSize: 15 }}
          className=" font-poppins-semibold"
        >
          {btnTitle}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
