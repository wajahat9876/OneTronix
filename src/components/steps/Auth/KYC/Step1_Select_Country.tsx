/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import {
  useBusinessKycMutation,
  useResetBusinessKycMutation,
} from '@/store/api/kyc/businessKycApi';
import { useBusinessDetails } from '@/store/selectors/business/business';
import ImgVerification from '@assets/images/KYC/img-id-verification.svg';
import BulletText from '@src/components/commons/BulletText';
import Button from '@src/components/globals/Button';
import Nationality from '@src/components/globals/Nationality';
import PermissionModal from '@src/components/globals/PermisisonModal';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import SignupStepsHeader from '@src/components/globals/SignupStepsHeader';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import usePermissions from '@src/hooks/camera&mediaPermisison/usePermission';
import useBusinessLogout from '@src/hooks/useBusinessLogout';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError } from '@src/hooks/useToasty';
import { kycStyles } from '@src/styles/KYC';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import IconStepDone from 'assets/icons/signup/icon-step-done.svg';
import IconStepInProgress from 'assets/icons/signup/icon-step-in-progress-ecc.svg';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

const Step1_Select_Country = ({ goTo }: MultiStepFormProps) => {
  const { auth_token, data } = useAppSelector(useBusinessDetails);
  const dispatch = useDispatch();
  const [resetKyc, { isLoading: resetLoading }] = useResetBusinessKycMutation();
  const { handleBusinessLogout } = useBusinessLogout();
  const [businessKyc, { isLoading }] = useBusinessKycMutation();
  // const { refetch } = useGetCurrentBusinessQuery(undefined, {
  //   skip: !auth_token,
  // });
  // useEffect(() => {
  //   refetch();
  // }, []);
  const handleKycLinkCall = async () => {
    try {
      // const result = await resetKyc({}).unwrap();

      // if (result) {
      const res = await businessKyc({}).unwrap();
      // dispatch(setBusinessKycUrl({ Url: res?.data?.data?.URL }));
      if (res?.data?.data?.URL) {
        goTo?.(1);
      }
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Something went wrong');
    }
  };
  // Camera & Media Permission
  const {
    hasCameraPermission,
    hasMediaPermission,
    requestCameraPermissions,
    requestMediaPermissions,
  } = usePermissions();
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const handleSubmit = () => {
    if (hasCameraPermission === 'denied' || hasMediaPermission === 'denied') {
      if (hasCameraPermission === 'denied') setShowCameraModal(true);
      if (hasMediaPermission === 'denied') setShowMediaModal(true);
    } else {
      handleKycLinkCall();
    }
  };
  // useEffect(() => {
  //   if (hasCameraPermission === 'denied') setShowCameraModal(true);
  //   if (hasMediaPermission === 'denied') setShowMediaModal(true);
  // }, [hasCameraPermission, hasMediaPermission]);
  return (
    <ScreenAuth
      title="Verify ID"
      style={{ backgroundColor: 'transparent' }}
      topColor="transparent"
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: true,
      }}
      back={() => {
        handleBusinessLogout();
      }}
    >
      <View style={[globalStyle.authTopCurvedCard]}>
        <SignupStepsHeader
          colorStepOne={Colors.light.theme.signupStepDoneBackground}
          colorStepTwo={Colors.light.theme.signupStepDoneBackground}
          colorStepThree={Colors.light.theme.signupStepInProgressBackground}
          titleStepOne="Terms & Policy"
          titleStepTwo="Details"
          titleStepThree="Verify ID"
          iconStepOne={<IconStepDone />}
          iconStepTwo={<IconStepDone />}
          iconStepThree={<IconStepInProgress />}
        />
        <PermissionModal
          showModal={showCameraModal}
          setShowModal={setShowCameraModal}
          title="We need to access your Camera to capture identity documents for verification."
          setPermission={requestCameraPermissions}
        />
        <PermissionModal
          type
          showModal={showMediaModal}
          setShowModal={setShowMediaModal}
          title="We need to access your gallery to capture identity documents for verification."
          setPermission={requestMediaPermissions}
        />
        <Text style={kycStyles.heading}>ID verification</Text>
        <View className="justify-center items-center mt-4">
          <ImgVerification />
        </View>
        <BulletText
          title="Make sure that you are in a well lit environment and that you use a
            readable document."
          marginTop={8}
          marginLeft={0}
        />
        <BulletText
          title="Make sure that you are alone in a well lit environment wearing no hat or glasses."
          marginTop={4}
          marginLeft={0}
        />
        <View style={{ ...globalStyle.buttonContinue, bottom: vs(16) }}>
          <View
            style={{
              marginLeft: hs(16),
              marginRight: hs(16),
              marginBottom: vs(16),
            }}
          >
            <Nationality />
          </View>
          <Button
            btnTitle="Continue"
            disabled={isLoading}
            loading={isLoading || resetLoading}
            onClick={() => {
              handleSubmit();
            }}
          />
        </View>
      </View>
    </ScreenAuth>
  );
};

export default Step1_Select_Country;
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Modal background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  settingsLink: {
    marginTop: 10,
  },
});
