/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable camelcase */
import { businessAuthApi } from '@/store/api/business/authApis';
import { setPackageId } from '@/store/slices/business/businessSlice';
import FeePlanDetails from '@src/components/commons/business/signup/account_types/FeePlanDetails';
import ExpandableCard from '@src/components/globals/ExpandableCard';
import {
  actions,
  initialState,
  reducer,
} from '@src/components/globals/ExpandableCard/reducer';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppDispatch } from '@src/hooks/useReduxHooks';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { useRouter } from 'expo-router';
import React, { useReducer } from 'react';
import { FlatList, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const Step1_Choose_Account_Type = ({ next, back }: MultiStepFormProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { accordionOpen } = state;
  const router = useRouter();
  const dispatchBusiness = useAppDispatch();
  const { data, isLoading, isFetching } =
    businessAuthApi.useBusinessFeePlansQuery();

  return (
    <ScreenAuth
      title="Account Types"
      style={{ backgroundColor: 'transparent' }}
      topColor="transparent"
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: false,
      }}
      back={() => {
        if (back) {
          back();
        } else {
          router.replace('/(auth)/Welcome');
        }
      }}
    >
      <View
        style={{
          flex: 1,
          marginTop: vs(20),
          paddingLeft: hs(16),
          paddingRight: hs(16),
          paddingTop: vs(16),
        }}
      >
        <Text
          style={{
            ...globalStyle.textMedium,
            marginTop: vs(32),
            marginLeft: hs(16),
            marginBottom: vs(16),
          }}
        >
          Choose Account Package
        </Text>

        <View className="flex-1">
          {isLoading || isFetching ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <ActivityIndicator
                size="large"
                color={Colors.light.theme.primaryColor}
              />
            </View>
          ) : (
            <FlatList
              // estimatedItemSize={121}
              data={data?.data || []}
              renderItem={({ item, index }) => {
                return (
                  <ExpandableCard
                    externalOpen={accordionOpen === `easy-personal${index}`}
                    isShowButton
                    externalToggle={() => {
                      dispatch(
                        actions.setData({
                          accordionOpen: `easy-personal${index}`,
                        }),
                      );
                    }}
                    externalButtonClick={() => {
                      // const packageId = item._id;
                      const packageId = item?.packageId;
                      dispatchBusiness(setPackageId(packageId));
                      if (next) next?.();
                    }}
                  >
                    <ExpandableCard.Header>
                      <>
                        <Text
                          style={{
                            ...globalStyle.textMedium,
                            marginTop: vs(8),
                          }}
                        >
                          {item.accountName}
                        </Text>
                        <Text
                          style={{
                            ...globalStyle.textRegular,
                            marginTop: vs(8),
                          }}
                        >
                          {item.description}
                        </Text>
                      </>
                    </ExpandableCard.Header>
                    <ExpandableCard.Body>
                      <FeePlanDetails
                        index={index}
                        title={item.accountName}
                        section={item}
                      />
                    </ExpandableCard.Body>
                  </ExpandableCard>
                );
              }}
            />
          )}
        </View>
      </View>
    </ScreenAuth>
  );
};

export default Step1_Choose_Account_Type;
