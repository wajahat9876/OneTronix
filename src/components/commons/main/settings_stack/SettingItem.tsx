import { AntDesign } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "@src/components/libraries";
import { hs, ms, vs } from "@utils/design/design";
import { Image, View } from "react-native";

interface ISettingItemProps {
  title: string;
  marginTop: number;
  onClick: () => void;
  isIconVisible?: boolean;
  icon?: any;
  borderBottomWidth?: number;
}

const SettingItem = (props: ISettingItemProps) => {
  const { title, marginTop, onClick, isIconVisible, icon, borderBottomWidth } =
    props;
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#F2F2F2",
        alignItems: "center",
        borderBottomWidth: borderBottomWidth,
        borderRadius: ms(10),
        shadowRadius: ms(16),
        width: "93%",
        alignSelf: "center",
        shadowColor: "#394779",
        shadowOffset: { width: ms(2), height: ms(2) },
        shadowOpacity: 0.05,
        padding: ms(16),
        marginRight: hs(16),
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: hs(16),
        paddingRight: hs(8),
        paddingTop: vs(10),
        paddingBottom: vs(10),
        marginTop,
        marginLeft: hs(0),
      }}
      onPress={onClick}
    >
      {isIconVisible ? (
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: hs(12) }}
        >
          <Image source={icon} style={{ width: hs(40), height: hs(40) }} />
          <Text
            style={{
              fontFamily: "Excon-Medium",
              fontSize: ms(14),
              color: "black",
            }}
          >
            {title}
          </Text>
        </View>
      ) : (
        <Text
          style={{
            fontFamily: "Excon-Medium",
            fontSize: ms(14),
            color: "black",
          }}
        >
          {title}
        </Text>
      )}

      <AntDesign name="right" size={20} color="gray" />
    </TouchableOpacity>
  );
};

export default SettingItem;
