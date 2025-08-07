/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleSheet, Text, TouchableOpacity } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { hs, ms } from '@utils/design/design';
import { IButtonTakeOrUploadPhotoProps } from './types';

const ButtonTakeOrUploadPhoto = (props: IButtonTakeOrUploadPhotoProps) => {
  const { title, icon, onClick } = props;
  return (
    <TouchableOpacity style={styles.container} onPress={onClick}>
      {icon}
      <Text style={styles.buttonTitle}>{title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '40%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.theme.backgroundBtnLightGray,
    borderRadius: ms(20),
    padding: ms(16),
    gap: hs(10),
  },
  buttonTitle: {
    fontSize: 14,
    fontFamily: 'poppins-medium',
  },
});
export default ButtonTakeOrUploadPhoto;
