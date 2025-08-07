/* eslint-disable import/order */
import { useLazyGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useBusinessDetails } from '@/store/selectors/business/business';
import AlertsSettingsItem from '@src/components/commons/main/settings_stack/AlertsSettingsItem';
import SettingItem from '@src/components/commons/main/settings_stack/SettingItem';
import LoadingModal from '@src/components/globals/LoadingModal';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { ScrollView, StyleSheet, Text } from '@src/components/libraries';
import { pageTransitionAnimation } from '@src/constants/Animation';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { ms, vs } from '@utils/design/design';
import CardImg from 'assets/icons/card/Horizontal Business.png';
import { useRouter } from 'expo-router';
import { Image, View } from 'react-native';
import Animated from 'react-native-reanimated';

const CardDetails = ({ goTo }: MultiStepFormProps) => {
  const router = useRouter();
  const [trigger, { isFetching }] = useLazyGetCurrentBusinessQuery();
  const { data } = useAppSelector(useBusinessDetails);
  // const [freezeBusinessCard, { isLoading }] =
  //   useChangeCardStatusBusinessMutation();
  // const [freezeCard, setFreezeCard] = useState<boolean>(false);
  // useEffect(() => {
  //   if (data?.cardStatus) {
  //     setFreezeCard(data.cardStatus === 'suspended');
  //   }
  // }, [data?.cardStatus]);
  const toggleFreezeCard = async () => {
    // const currentStatus = freezeCard;
    // const payload: any = {
    //   status: !currentStatus ? 'suspended' : 'active',
    // };
    // // Add reason only when suspending the card
    // if (!currentStatus) {
    //   payload.reason = 'user-requested';
    // }
    try {
      const result = await trigger().unwrap();
      if (result) {
        // const res = await freezeBusinessCard(payload).unwrap();
        // setFreezeCard(currentStatus);
        // renderToastSuccess(res?.message);
      }
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Something went wrong');
    }
  };
  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="card_details"
      style={{ flex: 1 }}
    >
      <ScreenAuth
        title="Card Details"
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
      >
        <View style={styles.container}>
          <View
            style={{ width: '100%', height: vs(200), marginBottom: ms(20) }}
          >
            <Image
              source={CardImg}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              ...globalStyle.textRegular,
              fontSize: 14,
              marginBottom: vs(8),
              fontStyle: 'italic',
            }}
          >
            Visa is a trademark owned by Visa International Service Association
            and used under license.
          </Text>
          <Text
            style={{
              ...globalStyle.textMedium,
              fontSize: 17,
              marginBottom: vs(8),
            }}
          >
            Manage Card
          </Text>
          <ScrollView style={{}}>
            {data?.cardStatus === 'inactive' ? (
              <SettingItem
                title="Activate Your Debit Card"
                onClick={() => {
                  goTo?.(4);
                }}
                marginTop={16}
              />
            ) : (
              <View>
                <AlertsSettingsItem
                  title="Freeze Card"
                  // switchValue={freezeCard}
                  switchValue
                  onSwitchValueChange={toggleFreezeCard}
                />
              </View>
            )}
            <SettingItem
              title="Block Card"
              onClick={() => {
                goTo?.(5);
              }}
              marginTop={16}
            />
          </ScrollView>
        </View>
        <LoadingModal isLoading={isFetching} key="loading-Buisnessmodal" />
      </ScreenAuth>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ms(20),
  },
});
export default CardDetails;
