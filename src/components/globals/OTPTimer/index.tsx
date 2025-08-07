/* eslint-disable react/require-default-props */
// /* eslint-disable react/require-default-props */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react/jsx-no-useless-fragment */
import { getRespValue } from '@utils/getRespValue';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Text, View } from 'react-native';

const OTPTimer = ({
  text,
  time = 120,
  light = false,
  handleExpired,
}: {
  text: string;
  time?: number;
  light?: boolean;
  handleExpired?: () => void;
}) => {
  const [secondsLeft, setSecondsLeft] = useState(time);
  const endTimeRef = useRef(Date.now() + time * 1000);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const updateTime = () => {
      const seconds = Math.max(
        Math.floor((endTimeRef.current - Date.now()) / 1000),
        0,
      );
      setSecondsLeft(seconds);
      if (seconds <= 0) {
        if (handleExpired) handleExpired();
      }
    };

    const intervalId = setInterval(updateTime, 1000);

    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          updateTime(); // sync time after resume
        }
        appState.current = nextAppState;
      },
    );

    return () => {
      clearInterval(intervalId);
      subscription.remove();
    };
  }, [handleExpired]);

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Text
        style={{
          fontSize: getRespValue(18),
          lineHeight: getRespValue(26),
          color: light ? 'black' : 'white',
          fontWeight: '600',
        }}
        className="font-aeonik px-4 pt-4 pb-4 w-full text-left"
      >
        {text}
        {moment().startOf('day').seconds(secondsLeft).format('mm:ss')}
      </Text>
    </View>
  );
};

export default OTPTimer;
// import { getRespValue } from '@utils/getRespValue';
// import moment from 'moment';
// import { useEffect, useState } from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// const OTPTimer = ({
//   text,
//   time,
//   light,
//   handleExpired,
// }: {
//   text: string;
//   time?: number;
//   light?: boolean;
//   handleExpired?: () => void;
// }) => {
//   const [secondsLeft, setSecondsLeft] = useState(time || 120);

//   useEffect(() => {
//     if (secondsLeft < 0) return;

//     const timerId = setInterval(() => {
//       setSecondsLeft(preVal => {
//         if (preVal === 0) {
//           if (handleExpired) handleExpired();
//           clearInterval(timerId);
//           return 0;
//         }
//         return preVal - 1;
//       });
//     }, 1000);

//     return () => {
//       clearInterval(timerId);
//     };

//   }, [secondsLeft]);

//   return (
//     <View
//       style={{
//         width: '100%',
//         alignItems: 'center',
//       }}
//     >
//       <Text
//         style={{
//           fontSize: getRespValue(18),
//           lineHeight: getRespValue(26),
//           color: light ? 'black' : 'white',
//           fontWeight: '600',
//         }}
//         className="font-aeonik px-4 pt-4 pb-4 w-full text-left"
//       >
//         {text}
//         {moment().startOf('day').seconds(secondsLeft).format('mm:ss')}
//       </Text>
//     </View>
//   );
// };
// export default OTPTimer;
