/* eslint-disable import/order */
/* eslint-disable camelcase */
import { useLazyGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import Button from '@src/components/globals/Button';
import FormikDropdownRNE from '@src/components/globals/DropdownRNE/FormikDropdownRNE';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { renderToastError } from '@src/hooks/useToasty';
import { globalStyle } from '@src/styles/globals';
import { ms, vs } from '@utils/design/design';
import CardImg from 'assets/icons/card/Horizontal Business.png';
import { useFormik } from 'formik';
import { Image, View } from 'react-native';
import * as Yup from 'yup';
import { CardProps } from '../type';

const Step1_Block_Card = ({ parentGoto }: CardProps) => {
  // const [blockUserCard, { isLoading }] = useChangeCardStatusBusinessMutation();
  const [trigger, { isFetching }] = useLazyGetCurrentBusinessQuery();
  const formik = useFormik({
    initialValues: {
      reason: '',
    },
    validationSchema: Yup.object({
      reason: Yup.string().required('Reason is required'),
    }),

    onSubmit: async () => {
      try {
        const result = await trigger().unwrap();
        if (result) {
          // const res = await blockUserCard({
          //   status: 'terminated',
          //   reason: values?.reason,
          // }).unwrap();
          parentGoto?.(0);
          // renderToastSuccess(res?.message);
        }
      } catch (error: any) {
        renderToastError(error?.data?.message || 'Something went wrong');
      }
    },
  });

  const data = [
    {
      label: 'Lost Card',
      value: 'lost-card',
    },
    {
      label: 'Stolen Card',
      value: 'stolen-card',
    },
    { label: 'Expired Card', value: 'expired-card' },
  ];
  return (
    <ScreenAuth
      title="Block Card"
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
        parentGoto?.(3);
      }}
    >
      <View className="mx-4 ">
        <View style={{ width: '100%', height: vs(210), marginBottom: ms(20) }}>
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
        <Text style={{ ...globalStyle.textMedium, fontSize: 20 }}>
          Block Debit Card
        </Text>
        <Text
          style={{ ...globalStyle.textMedium, fontSize: 18, marginTop: 10 }}
        >
          Reason
        </Text>
        <View
          style={{ backgroundColor: 'white', borderRadius: 10, marginTop: 5 }}
        >
          <FormikDropdownRNE
            data={data}
            formik={formik}
            dropdownType="custom"
            labelField="label"
            valueField="value"
            placeholder="Select Reason"
            name="reason"
            value={formik?.values?.reason}
            dropdownPosition="bottom"
            maxHeight={220}
            style={{ padding: 15 }}
          />
        </View>
      </View>
      <View style={{ ...globalStyle.buttonContinue, bottom: vs(24) }}>
        <Button
          btnTitle="Block Card"
          disabled={!formik?.values?.reason}
          loading={isFetching}
          onClick={() => {
            formik.handleSubmit();
          }}
        />
      </View>
    </ScreenAuth>
  );
};

export default Step1_Block_Card;
