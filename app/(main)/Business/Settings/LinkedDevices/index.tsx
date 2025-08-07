/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DesktopIcon from '@assets/icons/LinkedDevices/DesktopIcon.svg';
// import Dot from '@assets/icons/LinkedDevices/greenDot.png';
import { useBusinessDetails } from '@/store/selectors/business/business';
import PhoneIcon from '@assets/icons/LinkedDevices/HandSetIcon.svg';
import LaptopIcon from '@assets/icons/LinkedDevices/LaptopIcon.svg';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import Colors from '@src/constants/Colors';
import { MultiStepFormProps } from '@src/hooks/useMultiStepForm';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import { getRespValue } from '@utils/getRespValue';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';

const LinkedDevices = ({ goTo, back }: MultiStepFormProps) => {
  const { data: businessData } = useAppSelector(useBusinessDetails);
  const renderItem = ({ item }: any) => {
    const isPhone = item?.deviceType === 'Handset';
    const isLaptop = item?.deviceType === 'Tablet';
    const isDesktop = item?.deviceType === 'Desktop';

    let IconComponent;
    if (isPhone) {
      IconComponent = PhoneIcon;
    }
    if (isLaptop) {
      IconComponent = LaptopIcon;
    }
    if (isDesktop) {
      IconComponent = DesktopIcon;
    }

    return (
      <View style={styles.Card}>
        <View style={{ flexDirection: 'row' }}>
          {/* {IconComponent && ( */}
          <View style={{ width: 25, height: 25 }}>
            <PhoneIcon />
          </View>
          {/* )} */}
          {item.deviceModal ? (
            <Text style={styles.itemText}>{item?.deviceModal}</Text>
          ) : (
            <Text style={styles.itemText}>Unknown</Text>
          )}
          {/* {item?.notificationStatus && (
            <Image
              source={Dot}
              style={{ width: 15, height: 10, marginLeft: getRespValue(3) }}
            />
          )} */}
          {item?.isMainDevice && <Text style={styles.mainText}>Main</Text>}
        </View>
        {/*
        {item.deviceOS ? (
          <Text style={styles.itemText}>{item?.deviceOS}</Text>
        ) : (
          <Text style={styles.itemText}>Unknown</Text>
        )} */}
        {item?.notificationStatus ? (
          <Text style={[styles.activeTxt, { color: 'green' }]}>Active</Text>
        ) : (
          <Text style={[styles.activeTxt, { color: 'red' }]}>InActive</Text>
        )}
      </View>
    );
  };

  return (
    <ScreenAuth
      title="Linked Devices"
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
        goTo?.(0);
      }}
    >
      <View style={styles.container}>
        {businessData?.devices && businessData.devices.length > 0 ? (
          <FlatList
            data={businessData?.devices}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No Linked Devices</Text>
          </View>
        )}
      </View>
    </ScreenAuth>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  itemText: {
    marginLeft: 10,
    marginTop: 3,
  },
  activeTxt: { fontSize: getRespValue(15) },
  Card: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    width: '90%',
    padding: 20,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: Platform.OS === 'ios' ? 2 : 0,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  mainText: {
    fontSize: getRespValue(8),
    backgroundColor: '#686868',
    height: getRespValue(18),
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#686868',
    padding: 2,
    color: 'white',
    marginLeft: getRespValue(10),
    paddingHorizontal: getRespValue(4),
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    color: 'gray',
    fontWeight: 'bold',
  },
});

export default LinkedDevices;
