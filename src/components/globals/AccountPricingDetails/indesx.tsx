/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleSheet, Text } from '@src/components/libraries';
import { vs } from '@utils/design/design';
import { FlatList, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { IPricingProps } from './types';

const PricingDetails = ({
  title,
  subtitle,
  items,
  isLastIndex = false,
}: IPricingProps) => {
  // console.log(items, '===items');
  // Counter to track currency occurrences
  // const currencyCount = 0;

  // Function to conditionally apply margin if left value is 'currency'
  // const getItemStyle = (item: any) => {
  //   if (item?.left === 'currency') {
  //     // Only add marginTop for the second and subsequent occurrences of 'currency'
  //     if (currencyCount > 0) {
  //       return { marginTop: vs(16) };
  //     }
  //     currencyCount += 1; // Increment the counter for 'currency'
  //   }
  //   return {};
  // };

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <FlatList
        // estimatedItemSize={14}
        data={items}
        renderItem={({ item }) => {
          // Get the style based on the left value
          // const itemStyle = getItemStyle(item);

          return (
            <View style={styles.itemContainer}>
              {/* <View style={[styles.itemContainer, itemStyle]}> */}
              <Text style={styles.left}>{item.left}</Text>
              <Text style={styles.right}>{item.right}</Text>
            </View>
          );
        }}
      />

      {!isLastIndex && (
        <Divider
          style={{
            backgroundColor: '#7A7A7A',
            marginBottom: vs(16),
            marginTop: vs(16),
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 11.09,
    fontFamily: 'poppins-medium',
  },
  subtitle: {
    fontSize: 7.44,
    fontFamily: 'poppins-medium',
  },
  left: {
    fontSize: 7.45,
    fontFamily: 'poppins-medium',
    marginTop: vs(3),
    flex: 0.7,
    alignSelf: 'center',
  },
  right: {
    fontSize: 7.45,
    fontFamily: 'poppins',
    flex: 0.2,
    alignSelf: 'center',
  },
  footer: {
    fontSize: 7.45,
    fontFamily: 'poppins',
  },
  // Added container style for the list item
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

// PricingDetails.defaultProps = {
//   footerText: [],
//   isLastIndex: false,
// };

export default PricingDetails;
