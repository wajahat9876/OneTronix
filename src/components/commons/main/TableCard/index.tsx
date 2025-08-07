import Colors from '@src/constants/Colors';
import useCurrencyFlag from '@src/hooks/useCurrencyFlag';
import { ms, vs } from '@utils/design/design';
import React from 'react';
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Define the data type
export type TableRow = {
  name: string;
  currency: string;
  time: string;
};

type Props = {
  data: TableRow[];
};

const TableCard: React.FC<Props> = ({ data }) => {
  const { getFlagImage } = useCurrencyFlag();
  return (
    <View style={styles.card}>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: vs(20) }}
        renderItem={({ item, index }) => (
          <View style={[styles.row, index === 0 && styles.headerRow]}>
            <Text
              style={[
                styles.cell,
                index === 0 ? styles.headerText : styles.dataText,
              ]}
            >
              {item.name}
            </Text>

            {index === 0 ? (
              <Text style={[styles.cell, styles.headerText]}>
                {item.currency}
              </Text>
            ) : (
              <View style={[styles.cell, styles.flagContainer]}>
                <Image
                  style={styles.flag}
                  source={getFlagImage(item.currency)}
                  resizeMode="contain"
                />
                <Text style={styles.dataText}>{item.currency}</Text>
              </View>
            )}

            <Text
              style={[
                styles.cell,
                index === 0 ? styles.headerText : styles.dataText,
              ]}
            >
              {item.time}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => `cutOff-${item.name}-${index}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: ms(10),
    borderRadius: 10,
    marginVertical: vs(8),
    shadowColor: '#000',
    width: '90%',
    alignSelf: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: Platform.OS === 'ios' ? 2 : 0,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(5),
  },

  flag: {
    width: 20,
    height: 15,
    borderRadius: 2,
  },
  row: {
    flexDirection: 'row',
    marginBottom: vs(10),
    padding: ms(8),
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  headerRow: {
    backgroundColor: '#f9f9f9',
  },
  cell: {
    flex: 1,
    fontSize: ms(12),
    textAlign: 'center',
  },
  headerText: {
    color: Colors.light.theme.eccRedColor,
    fontWeight: '600',
  },
  dataText: {
    color: '#000',
    fontWeight: '400',
  },
});

export default TableCard;
