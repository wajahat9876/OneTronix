/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import {
  useDeleteMultiPayeeMutation,
  useDeletePayeeMutation,
  useLazyGetMultiPayeeQuery,
  useLazyGetPayeeQuery,
} from '@/store/api/business/mainApis';
import { useBusinessDetails } from '@/store/selectors/business/business';
import Button from '@src/components/globals/Button';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import useCapitalizeFirstWord from '@src/hooks/useCapitalizeFirst';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { getRespValue } from '@utils/getRespValue';
import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { DeleteProps } from './type';

const Step1_Delete_Payee = ({ parentGoto, next }: DeleteProps) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { beneficiaryDetails, data: businessData } =
    useAppSelector(useBusinessDetails);
  const [deleteGbPayee, { isLoading: GbLoading }] = useDeletePayeeMutation();
  const [deleteMultiPayee, { isLoading: multiLoading }] =
    useDeleteMultiPayeeMutation();
  const [trigger] = useLazyGetPayeeQuery();
  const [multiTrigger] = useLazyGetMultiPayeeQuery();
  const { capitalizeFirstWord } = useCapitalizeFirstWord();
  const handleDeleteGBPPayee = async () => {
    try {
      const res = await deleteGbPayee({
        accountNo: beneficiaryDetails?.accountNo,
      }).unwrap();
      renderToastSuccess(res?.message);
      if (res) {
        trigger({});
        next?.();
      }
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Something went wrong');
    }
  };
  const handleDeleteMultiPayee = async () => {
    try {
      const res = await deleteMultiPayee({
        _id: beneficiaryDetails?._id,
      }).unwrap();
      renderToastSuccess(res?.message);
      multiTrigger({});
      next?.();
    } catch (error: any) {
      renderToastError(error?.data?.message || 'Something went wrong');
    }
  };
  const handleOpenModal = () => {
    setModalVisible(true);
  };
  const handleSubmit = () => {
    if (businessData?.activeCurrency === 1) {
      handleDeleteGBPPayee();
    } else {
      handleDeleteMultiPayee();
    }
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  return (
    <ScreenAuth
      title="Delete Payee"
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
        parentGoto?.(0);
      }}
    >
      <View style={globalStyle.authTopCurvedCard}>
        <Text
          style={{
            marginTop: vs(30),
            alignSelf: 'center',
            marginLeft: hs(0),
            color: 'black',
            fontWeight: '600',
            fontSize: 25,
          }}
        >
          Remove from Payee List
        </Text>
        {businessData?.activeCurrency === 1 && (
          <View
            style={{
              flex: 1,
              paddingLeft: hs(30),
              paddingRight: hs(30),
              marginTop: 30,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}
            >
              <Text style={styles.subTitle}>Name:</Text>
              <Text style={styles.txt}>
                {capitalizeFirstWord(beneficiaryDetails?.name ?? '')}
              </Text>
            </View>
            <View
              style={{
                borderBottomWidth: 0.5,
                marginTop: 10,
                opacity: 0.2,
                marginBottom: 10,
              }}
            />

            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.subTitle}>Account Number:</Text>
                <Text style={styles.txt}>{beneficiaryDetails?.accountNo}</Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 0.5,
                  marginTop: 10,
                  opacity: 0.2,
                  marginBottom: 10,
                }}
              />
            </>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={styles.subTitle}>Sort Code:</Text>
              <Text style={styles.txt}>
                {beneficiaryDetails?.sortCode || 'NA'}
              </Text>
            </View>
            <View
              style={{
                borderBottomWidth: 0.5,
                marginTop: 10,
                opacity: 0.2,
                marginBottom: 10,
              }}
            />
          </View>
        )}
        {businessData?.activeCurrency !== 1 && (
          <View
            style={{
              flex: 1,
              paddingLeft: hs(30),
              paddingRight: hs(30),
              marginTop: 30,
            }}
          >
            {beneficiaryDetails?.payeeName && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={styles.subTitle}>Name:</Text>
                  <Text style={styles.txt}>
                    {beneficiaryDetails?.payeeName}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    marginTop: 10,
                    opacity: 0.2,
                    marginBottom: 10,
                  }}
                />
              </>
            )}

            {beneficiaryDetails?.iban && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={styles.subTitle}>IBAN:</Text>
                  <Text style={styles.txt}>{beneficiaryDetails?.iban}</Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    marginTop: 10,
                    opacity: 0.2,
                    marginBottom: 10,
                  }}
                />
              </>
            )}
            {beneficiaryDetails?.accountNumber && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={styles.subTitle}>Account Number:</Text>
                  <Text style={styles.txt}>
                    {beneficiaryDetails?.accountNumber}
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    marginTop: 10,
                    opacity: 0.2,
                    marginBottom: 10,
                  }}
                />
              </>
            )}
          </View>
        )}
        <View style={{ ...globalStyle.buttonContinue, bottom: vs(26) }}>
          <Button
            btnTitle="Delete"
            // loading={GbLoading || multiLoading}
            onClick={() => {
              handleOpenModal();
            }}
          />
        </View>
      </View>
      <Modal
        transparent
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Are you sure you want to Delete?
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                btnTitle="Yes"
                btnTitleColor="white"
                loading={GbLoading || multiLoading}
                onClick={handleSubmit}
                btnColor="#000000"
                disabled={GbLoading || multiLoading}
              />
              <Button
                btnTitleColor="black"
                btnTitle="No"
                onClick={handleCloseModal}
                btnColor="#F8F9FE"
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScreenAuth>
  );
};

export default Step1_Delete_Payee;
const styles = StyleSheet.create({
  txt: {
    fontSize: getRespValue(18),
    fontWeight: '400',
  },
  subTitle: {
    fontSize: getRespValue(18),
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '85%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});
