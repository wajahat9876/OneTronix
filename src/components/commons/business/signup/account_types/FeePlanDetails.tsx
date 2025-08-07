/* eslint-disable react/no-array-index-key */
import { Text } from '@src/components/libraries';
import useCapitalizeFirstWord from '@src/hooks/useCapitalizeFirst';
import useCurrencyFlag from '@src/hooks/useCurrencyFlag';
import { accountTypeExpandedStyle } from '@src/styles/Signup';
import { vs } from '@utils/design/design';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown'; // Import Dropdown
import { BusinessFeePlanImages } from './images';
import { IFeePlanProps } from './types';

const FeePlanDetails = (props: IFeePlanProps) => {
  const { index, title, section: data } = props;
  const { getCurrencySymbol } = useCurrencyFlag();
  const { capitalizeFirstWord } = useCapitalizeFirstWord();
  const formatNestedObject = (obj: any, prefix = '') => {
    return Object.entries(obj)
      .filter(([key]) => key !== '_id') // it ensure not to map _id from data
      .flatMap(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return formatNestedObject(value, `${prefix}${key} - `);
        }
        return {
          label: `${prefix}${key.replace(/([A-Z])/g, ' $1').trim()}`,
          value: value ?? 'N/A',
        };
      });
  };

  const otherCurrencies = data.payments?.otherCurrencies || [];
  const [selectedCurrency, setSelectedCurrency] = useState(
    otherCurrencies.length > 0 ? otherCurrencies[0].currency : '',
  );

  const selectedCurrencyData =
    otherCurrencies.find(
      (currency: any) => currency.currency === selectedCurrency,
    ) || {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { otherCurrencies: _, ...filteredPayments } = data.payments || {};

  const mappedSections = [
    { title: 'Account Fees', items: formatNestedObject(data.accountFee) },
    { title: 'Other Fees', items: formatNestedObject(data.otherFee) },
    {
      title: 'Corporate Accounts',
      items: formatNestedObject(data.corporateAccounts),
    },
  ];

  return (
    <View className="w-full">
      <View className="self-center">{BusinessFeePlanImages[index]}</View>
      <Text style={accountTypeExpandedStyle.heading}>{title}</Text>

      <FlatList
        className="mt-4"
        contentContainerStyle={{ paddingTop: vs(24) }}
        data={mappedSections}
        renderItem={({ item }) => (
          <View className="mb-4">
            <Text className="text-lg font-bold mb-2">{item.title}</Text>
            {item.items.map((entry: any, idx: any) => {
              const shouldHideSymbol =
                (item.title === 'Corporate Accounts' &&
                  entry.label === 'daily Transaction Volume') ||
                entry.label === 'weekly Transaction Volume';
              return (
                <View
                  key={idx}
                  className="flex-row justify-between px-2 py-1  "
                >
                  <Text className="text-base " style={{ fontSize: 9 }}>
                    {capitalizeFirstWord(entry.label)}
                  </Text>
                  <Text className="text-base " style={{ fontSize: 8 }}>
                    {shouldHideSymbol
                      ? Number(entry.value ?? 0).toFixed(2)
                      : `£${Number(entry.value ?? 0).toFixed(2)}`}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
        // eslint-disable-next-line @typescript-eslint/no-shadow
        keyExtractor={(_, index) => index.toString()}
      />

      {/* Payments Section */}
      <View className="mt-4">
        <Text className="text-lg font-bold mb-2">Payments</Text>

        {Object.keys(filteredPayments).length > 0 &&
          formatNestedObject(filteredPayments).map((entry: any, idx: any) => (
            <View key={idx} className="flex-row justify-between px-2 py-1  ">
              <Text className="text-base" style={{ fontSize: 9 }}>
                {capitalizeFirstWord(entry.label)}
              </Text>
              <Text className="text-base " style={{ fontSize: 8 }}>
                {`£${Number(entry.value ?? 0).toFixed(2)}`}
              </Text>
            </View>
          ))}

        {/* Other Currencies Dropdown */}
        {otherCurrencies.length > 0 && (
          <View className="mt-4">
            <Text className="text-lg font-bold mb-2">Select Currency</Text>
            <Dropdown
              data={otherCurrencies.map((currency: any) => ({
                label: currency.currency,
                value: currency.currency,
              }))}
              labelField="label"
              valueField="value"
              value={selectedCurrency}
              onChange={item => setSelectedCurrency(item.value)}
              style={{
                height: 50,
                backgroundColor: '#f0f0f0',
                borderRadius: 8,
                paddingHorizontal: 10,
              }}
              placeholder="Select a currency"
            />

            {/* Show selected currency details */}
            {selectedCurrency && (
              <View className="mt-2">
                {formatNestedObject(selectedCurrencyData).map(
                  (entry: any, idx: any) => {
                    const isPercentField =
                      entry.label ===
                        'fasterPaymentsInbound - percent Per Transcation' ||
                      entry.label ===
                        'fasterPaymentsOutbound - percent Per Transcation1';
                    const shouldHideSymbol =
                      entry.label === 'currency' || isPercentField;
                    const displayValueIfPercentage = `${entry.value}${
                      isPercentField ? '%' : ''
                    }`;
                    return (
                      <View
                        key={idx}
                        className="flex-row justify-between px-2 py-1"
                      >
                        <Text
                          className="text-base text-gray-700"
                          style={{ fontSize: 9 }}
                        >
                          {capitalizeFirstWord(entry.label)}
                        </Text>
                        <Text className="text-base " style={{ fontSize: 8 }}>
                          {shouldHideSymbol
                            ? displayValueIfPercentage
                            : `${getCurrencySymbol(selectedCurrency)}${Number(
                                entry.value ?? 0,
                              ).toFixed(2)}`}
                        </Text>
                      </View>
                    );
                  },
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default FeePlanDetails;
