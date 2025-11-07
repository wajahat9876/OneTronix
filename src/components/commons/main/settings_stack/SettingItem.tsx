import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "@src/components/libraries";
import { globalStyle } from "@src/styles/globals";
import { hs, ms, vs } from "@utils/design/design";

interface ISettingItemProps {
  title: string;
  marginTop: number;
  onClick: () => void;
}

const SettingItem = (props: ISettingItemProps) => {
  const { title, marginTop, onClick } = props;
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#F2F2F2",
        alignItems: "center",
        borderRadius: ms(16),
        shadowRadius: ms(16),
        shadowColor: "#394779",
        shadowOffset: { width: ms(2), height: ms(2) },
        shadowOpacity: 0.05,
        padding: ms(16),

        marginRight: hs(16),
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: hs(16),
        paddingRight: hs(8),
        paddingTop: vs(8),
        paddingBottom: vs(8),
        marginTop,
        marginLeft: hs(0),
      }}
      onPress={onClick}
    >
      <Text
        style={{ ...globalStyle.textMedium, fontSize: 15.34, color: "black" }}
      >
        {title}
      </Text>
      <MaterialIcons name="arrow-right" size={42} color="black" />
    </TouchableOpacity>
  );
};

export default SettingItem;
