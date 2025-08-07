/* eslint-disable react/require-default-props */
import { TouchableOpacity } from '@src/components/libraries';
import CountDownCircleTimer from '@src/components/libraries/CircleTimer';
import Colors from '@src/constants/Colors';
import { getRespValue } from '@utils/getRespValue';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TimerProps {
  creationDateTime: string; // Pass transaction creation time
  item: any;
  onPress?: () => void;
}
const Timer: React.FC<TimerProps> = ({ creationDateTime, item, onPress }) => {
  const createdAt = moment.utc(creationDateTime);
  const expiryTime = createdAt.add(10, 'minutes');
  const [remainingTimer, setRemainingTimer] = useState<number>(
    Math.max(expiryTime.diff(moment.utc(), 'seconds'), 0),
  );
  const [complete, setComplete] = useState(false);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeLeft = Math.max(expiryTime.diff(moment.utc(), 'seconds'), 0);
      setRemainingTimer(timeLeft);
      if (timeLeft === 0) clearInterval(intervalId);
      setComplete(true);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [expiryTime, createdAt, complete]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <>
      {remainingTimer > 0 || !complete ? (
        <TouchableOpacity onPress={onPress} style={styles.transactionItem}>
          <View
            style={{
              justifyContent: 'space-between',
              flex: 1,
            }}
          >
            <Text>{item?.merchant.name}</Text>
            <Text>
              {`${item?.transaction.amount} ${item?.transaction.currency}`}
            </Text>
          </View>
          <CountDownCircleTimer
            isPlaying
            strokeWidth={4}
            initialRemainingTime={remainingTimer}
            duration={600}
            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[600, 300, 120, 0]}
            size={55}
            onComplete={() => {
              setComplete(true);
            }}
          >
            {({ remainingTime }) => (
              <Text
                style={{ fontSize: 10, fontWeight: 'bold', color: '#004777' }}
              >
                {formatTime(remainingTime)}
              </Text>
            )}
          </CountDownCircleTimer>
        </TouchableOpacity>
      ) : (
        <View style={styles.transactionItem}>
          <View>
            <Text>{item?.merchant.name}</Text>
            <Text>
              {`${item?.transaction.amount} ${item?.transaction.currency}`}
            </Text>
          </View>
          <Text style={styles.expiredText}>Approval Expired</Text>
        </View>
      )}
      <View />
    </>
  );
};

export default Timer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.theme.backgroundTopCurveSection,
    paddingVertical: 40,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  list: { paddingBottom: 16 },
  transactionItem: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  transactionId: { fontSize: 16, fontWeight: '500', paddingRight: 5 },
  timerText: { fontSize: 10, fontWeight: 'bold', color: '#004777' },
  expiredText: {
    fontSize: getRespValue(16),
    fontWeight: 'bold',
    color: 'red',
    paddingVertical: 20,
  },
  approveBtn: {
    flexDirection: 'row',
    backgroundColor: '#F1FFF2',
    padding: getRespValue(18),
    justifyContent: 'center',
    width: '63%',
    borderRadius: 15,
    alignSelf: 'center',
    borderColor: 'green',
    borderWidth: 1.5,
    marginTop: getRespValue(20),
  },
  rejectBtn: {
    flexDirection: 'row',
    backgroundColor: '#FEE6E6',
    padding: getRespValue(18),
    justifyContent: 'center',
    width: '63%',
    borderRadius: 15,
    alignSelf: 'center',
    borderColor: 'red',
    borderWidth: 1.5,
    marginTop: getRespValue(20),
  },
  wrapView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: getRespValue(60),
    marginBottom: getRespValue(20),
  },
  subHeading: { fontWeight: '700', fontSize: getRespValue(18) },
  txt: { marginLeft: 10, fontSize: getRespValue(18) },
});
