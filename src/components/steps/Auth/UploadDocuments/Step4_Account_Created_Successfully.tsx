/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable camelcase */
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Logo from '@assets/eccLogo/ecc 1.svg';
import Tick from '@assets/icons/tickCercial/circuleTick.svg';
import BackImage from '@assets/images/BackgroundImage/backgroundcongratulations.png';
import BackgroundImage from '@src/components/globals/BackgroundImage';
import Button from '@src/components/globals/Button';
import { SafeAreaView, StyleSheet, Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import useBusinessLogout from '@src/hooks/useBusinessLogout';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastSuccess } from '@src/hooks/useToasty';
import { kycStyles } from '@src/styles/KYC';
import { hs, vs } from '@utils/design/design';
import React, { useEffect } from 'react';
import { View } from 'react-native';

const Step4_Account_Created_Successfully = () => {
  const { auth_token, data: businessData } = useAppSelector(useBusinessDetails);
  const { refetch, isFetching } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const { handleBusinessLogout } = useBusinessLogout();
  useEffect(() => {
    if (!businessData?.isVerified) {
      renderToastSuccess('Documented submitted please wait a while');
    }
  }, [businessData]);

  return (
    <>
      <BackgroundImage src={BackImage} />
      <SafeAreaView style={styles.container}>
        <Logo style={styles.logo} />
        <Text
          style={{
            ...kycStyles.heading,
            marginTop: vs(50),
            marginLeft: hs(0),
            color: Colors.light.theme.white,
          }}
        >
          Congratulations!
        </Text>
        <Tick style={styles.tick} />

        <Text
          style={styles.title}
        >{` Yey! ID Verification\ncompleted Successfully`}</Text>
        <Text
          style={styles.subtitle}
        >{`Congratulations! Your Id Verifications steps\n has been completed sucessfully. `}</Text>
        <View style={{ ...kycStyles.button, bottom: vs(120) }}>
          <Button
            btnColor="rgba(128, 128, 128, 0.5)"
            btnTitleColor="white"
            btnTitle="Check Status"
            loading={isFetching}
            onClick={() => {
              refetch();
            }}
          />
        </View>
        <View
          style={{
            ...kycStyles.button,
            bottom: vs(56),
          }}
        >
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
    marginTop: vs(6),
  },
  title: {
    color: 'white',
    fontFamily: 'poppins-semibold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: vs(50),
    marginLeft: hs(8),
    marginRight: hs(8),
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.theme.white,
    textAlign: 'center',
    marginTop: vs(35),
  },
  logo: {
    marginTop: vs(35),
  },
  tick: {
    marginTop: vs(30),
  },
  // backgroungimage: {
  //   opacity: 1,
  // },
});
export default Step4_Account_Created_Successfully;
function renderToastAlert(arg0: string) {
  throw new Error('Function not implemented.');
}
