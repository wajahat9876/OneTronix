import ArrowBackDark from '@assets/icons/LeftSmall.svg';
import BottomSheet from '@gorhom/bottom-sheet';
import Colors from '@src/constants/Colors';
import { hs } from '@utils/design/design';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '../Button';

interface FilterProps {
  snapPoints: any;
  bottomSheetRef: any;
  handleApply: any;
  closeSheet: () => void;
}

const TransactionFilters = (props: FilterProps) => {
  const { snapPoints, bottomSheetRef, handleApply, closeSheet } = props;
  const initialTransferType = 'all';
  const [transferType, setTransferType] = useState(initialTransferType);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isAll, setIsAll] = useState(true);
  const [appliedTransferType, setAppliedTransferType] =
    useState(initialTransferType);
  const resetFilters = () => {
    setTransferType(appliedTransferType);
    setIsCheckedIn(appliedTransferType === 'incomingTransfer');
    setIsCheckedOut(appliedTransferType === 'outgoingTransfer');
    setIsAll(appliedTransferType === 'all');
  };
  // Sync UI with current state
  useEffect(() => {
    resetFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedTransferType, closeSheet]);
  const handleIncomingPress = () => {
    setTransferType('incomingTransfer');
    setIsCheckedIn(true);
    setIsCheckedOut(false);
    setIsAll(false);
  };

  const handleOutgoingPress = () => {
    setTransferType('outgoingTransfer');
    setIsCheckedIn(false);
    setIsCheckedOut(true);
    setIsAll(false);
  };
  const handleAll = () => {
    setTransferType('all');
    setIsCheckedIn(false);
    setIsCheckedOut(false);
    setIsAll(true);
  };

  // const [toDate, setToDate] = useState<string | undefined>(undefined);
  // const [fromDate, setFromDate] = useState<string | undefined>(undefined);
  return (
    <BottomSheet
      handleIndicatorStyle={{ backgroundColor: 'transparent' }}
      backgroundStyle={styles.bottomSheet}
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.headerAuth}>
          <TouchableOpacity
            style={{ marginLeft: 20 }}
            onPress={() => {
              closeSheet();
              resetFilters();
            }}
          >
            <ArrowBackDark />
          </TouchableOpacity>
          <Text style={styles.mainHeading}>Filter</Text>
        </View>
        <View style={styles.mainContainer}>
          {/* 1st Choice */}
          <Text style={styles.subHeading}>Transfer Type</Text>
          <View className="flex-row  justify-center">
            <TouchableOpacity
              onPress={handleAll}
              style={[
                styles.choiceBtn,
                {
                  backgroundColor: isAll
                    ? '#EBECF3'
                    : Colors.light.theme.backgroundTopCurveSection,
                },
              ]}
            >
              <Text style={{ color: 'black' }}>All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.toggleView}>
            <TouchableOpacity
              onPress={handleIncomingPress}
              style={[
                styles.choiceBtn,
                {
                  backgroundColor: isCheckedIn
                    ? '#EBECF3'
                    : Colors.light.theme.backgroundTopCurveSection,
                },
              ]}
            >
              <Text style={{ color: 'black' }}>Incoming</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleOutgoingPress}
              style={[
                styles.choiceBtn,
                {
                  backgroundColor: isCheckedOut
                    ? '#EBECF3'
                    : Colors.light.theme.backgroundTopCurveSection,
                  marginLeft: 5,
                },
              ]}
            >
              <Text style={{ color: 'black' }}>Outgoing</Text>
            </TouchableOpacity>
          </View>
          {/* 2nd choice */}

          {/* DatePicker */}
          {/* <Text style={styles.subHeading}>Transfer Date</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: '50%' }}>
              <DatePicker
                value={fromDate}
                inputProps={{
                  ...textInputUnderlinedProps,
                  placeholder: 'From',
                  style: {
                    fontSize: ms(18),
                  },
                }}
                onDateConfirm={date => {
                  setFromDate(moment(date).format('YYYY-MM-DD'));
                }}
                datePickerProps={{
                  date: fromDate,
                  maxDate: moment(new Date(), 'YYYY-MM-DD').toDate(),
                }}
              />
            </View>
            <View style={{ width: '50%' }}>
              <DatePicker
                value={toDate}
                inputProps={{
                  ...textInputUnderlinedProps,
                  placeholder: 'To',
                  style: {
                    fontSize: ms(18),
                  },
                }}
                onDateConfirm={date => {
                  setToDate(moment(date).format('YYYY-MM-DD'));
                }}
                datePickerProps={{
                  date: toDate,
                  maxDate: moment(new Date(), 'YYYY-MM-DD').toDate(),
                  mode: 'date',
                }}
              />
            </View>
          </View> */}
          <View style={{ marginTop: 30 }}>
            <Button
              btnTitle="Apply"
              onClick={() => {
                handleApply(transferType);
                setAppliedTransferType(transferType);

                closeSheet();
              }}
            />
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

export default TransactionFilters;

const styles = StyleSheet.create({
  mainContainer: { flex: 1, paddingLeft: hs(16), paddingRight: hs(16) },
  headerAuth: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  toggleView: { flexDirection: 'row', margin: 10, alignSelf: 'center' },
  mainHeading: {
    alignSelf: 'center',
    color: '#2F394F',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    marginLeft: 130,
  },
  choiceBtn: {
    width: 170,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  subHeading: {
    marginBottom: 15,
    fontWeight: '600',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderCurve: 'circular',
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#f9f9f9',
  },

  checkBox: {
    alignContent: 'center',
    margin: 8,
  },
});
