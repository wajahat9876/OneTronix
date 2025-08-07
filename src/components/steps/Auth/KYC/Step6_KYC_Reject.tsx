/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable camelcase */
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useBusinessDetails } from '@/store/selectors/business/business';
import RedCross from '@assets/icons/redCross.png';
import backImage from '@assets/images/BackgroundImage/KycBackground.png';
import BackgroundImage from '@src/components/globals/BackgroundImage';
import Button from '@src/components/globals/Button';
import { SafeAreaView, StyleSheet, Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import useBusinessLogout from '@src/hooks/useBusinessLogout';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { kycStyles } from '@src/styles/KYC';
import { hs, vs } from '@utils/design/design';
import React from 'react';
import { Image, View } from 'react-native';

const Step6_KYC_Reject = () => {
  const { auth_token } = useAppSelector(useBusinessDetails);
  const { refetch, isFetching } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const { handleBusinessLogout } = useBusinessLogout();
  // eslint-disable-next-line consistent-return
  const checkStatus = () => {
    refetch();
  };

  return (
    <>
      <BackgroundImage src={backImage} />
      <SafeAreaView style={styles.container}>
        <View style={styles.checkIcon}>
          <Image source={RedCross} style={{ width: 100, height: 100 }} />
        </View>
        <Text style={styles.title}>{`Something didn't go as planned`}</Text>
        <Text
          style={styles.subtitle}
        >{` Our team is completing an additional check of your documents so that you can become a resident of the Easy E Money World`}</Text>
        <View style={{ ...kycStyles.button, bottom: vs(125) }}>
          <Button
            btnColor="rgba(128, 128, 128, 0.5)"
            btnTitleColor="white"
            btnTitle="Check Status"
            loading={isFetching}
            onClick={() => {
              checkStatus();
            }}
          />
        </View>
        <View style={{ ...kycStyles.button, bottom: vs(56) }}>
          <Button
            btnColor="rgba(128, 128, 128, 0.5)"
            btnTitleColor="white"
            btnTitle="Logout"
            onClick={() => {
              handleBusinessLogout();
            }}
          />
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  checkIcon: {
    marginTop: vs(56),
  },
  title: {
    color: 'white',
    fontFamily: 'poppins-semibold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: vs(32),
    marginLeft: hs(8),
    marginRight: hs(8),
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.theme.white,
    textAlign: 'center',
    marginTop: vs(32),
    paddingHorizontal: 10,
  },
});
export default Step6_KYC_Reject;
