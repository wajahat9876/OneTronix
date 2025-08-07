/* eslint-disable import/order */
import { useBusinessDetails } from '@/store/selectors/business/business';
import IconPerson from '@assets/icons/card/icon-person.svg';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { pageTransitionAnimation } from '@src/constants/Animation';
import Colors from '@src/constants/Colors';
import useCapitalizeFirstWord from '@src/hooks/useCapitalizeFirst';
import useCurrencyFlag from '@src/hooks/useCurrencyFlag';
import useExtractSortCode from '@src/hooks/useExtractSortCode';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { hs, ms } from '@utils/design/design';
import { getRespValue } from '@utils/getRespValue';
import { getAmountSize } from '@utils/helpers/resizeText';
import { useRouter } from 'expo-router';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

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
      style={{ flex: 1 }}
    >
      <ScreenAuth
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
      >
        <View style={styles.card}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10 }}
            >
              <View style={styles.iconPerson}>
                <IconPerson />
              </View>
              <Text
                style={{
                  flex: 1,
                  marginTop: getRespValue(10),
                  marginLeft: 10,
                  fontWeight: '400',
                  flexShrink: 1,
                  fontSize: getAmountSize(businessData?.businessnName?.length),
                }}
              >
                {capitalizeFirstWord(businessData?.businessnName)}
              </Text>
            </View>

            <View style={styles.container}>
              <View style={styles.infoRow}>
                <Text style={styles.subTitle}>Business Name</Text>
                <Text numberOfLines={2} style={styles.txt}>
                  {capitalizeFirstWord(businessData?.businessnName)}
                </Text>
              </View>
              <View
                style={{ borderBottomWidth: 0.5, marginTop: 10, opacity: 0.2 }}
              />

              <View style={styles.infoRow}>
                <Text style={styles.subTitle}>Email</Text>
                <Text style={styles.txt}>{businessData?.email}</Text>
              </View>
              <View
                style={{ borderBottomWidth: 0.5, marginTop: 10, opacity: 0.2 }}
              />
              <View style={styles.infoRow}>
                <Text style={styles.subTitle}>Mobile Number</Text>
                <Text style={styles.txt}>{businessData?.phoneNumber}</Text>
              </View>
              <View
                style={{ borderBottomWidth: 0.5, marginTop: 10, opacity: 0.2 }}
              />
              {businessData?.activeCurrency === 1 ? (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.subTitle}>Account Number</Text>
                    <Text style={styles.txt}>
                      {businessData?.accountNumber}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 0.5,
                      marginTop: 10,
                      opacity: 0.2,
                    }}
                  />
                  <View style={styles.infoRow}>
                    <Text style={styles.subTitle}>Sort Code</Text>
                    <Text style={styles.txt}>
                      {extractSortCode(
                        businessData?.activeCurrencyAccount?.[0]?.iban,
                      )}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 0.5,
                      marginTop: 10,
                      opacity: 0.2,
                    }}
                  />
                </>
              ) : (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.subTitle}>IBAN</Text>
                    <Text style={styles.txt}>
                      {businessData?.activeCurrencyAccount?.[0]?.iban}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 0.5,
                      marginTop: 10,
                      opacity: 0.2,
                    }}
                  />
                </>
              )}

              <View style={styles.infoRow}>
                <Text style={styles.subTitle}>Currency</Text>
                <Text style={styles.txt}>
                  {getCurrencyCode(businessData?.activeCurrency)}
                </Text>
              </View>

              <View
                style={{
                  borderBottomWidth: 0.5,
                  marginTop: 10,
                  opacity: 0.2,
                  marginBottom: 70,
                }}
              />
            </View>
          </ScrollView>
        </View>
      </ScreenAuth>
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
    backgroundColor: '#e0e0e0',
    padding: ms(10),
    borderRadius: ms(100),
    width: '12%',
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    width: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: Platform.OS === 'ios' ? 2 : 0,
  },
  txt: {
    width: '60%',
    fontSize: getRespValue(16),
    fontWeight: '400',
    textAlign: 'right',
  },
  subTitle: {
    width: '40%',
    fontSize: getRespValue(16),
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  divider: {
    borderBottomWidth: 0.5,
    marginTop: 10,
    opacity: 0.2,
  },
});

export default Info;
