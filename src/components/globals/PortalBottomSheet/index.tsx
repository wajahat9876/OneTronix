/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */

import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import BottomSheet, { BottomSheetProps } from '@gorhom/bottom-sheet';
import { AnimatePresence, MotiView } from 'moti';
import { Pressable, TouchableOpacity } from 'react-native';
// import { Portal } from 'react-native-paper';
import { Portal } from '@gorhom/portal';

interface PortalBottomSheetProps extends Omit<BottomSheetProps, 'snapPoints'> {
  snapPoints?: string[];
  children: React.ReactNode;
  TouchComponent: React.FC<any>;
  isCustomTouch?: boolean;
}

const PortalBottomSheet = forwardRef<any, PortalBottomSheetProps>(
  (
    { children, TouchComponent, snapPoints = ['100%'], isCustomTouch, ...rest },
    ref,
  ) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [index, setIndex] = useState(-1);

    const snapPointsThis = useMemo(() => snapPoints, [snapPoints]);

    useImperativeHandle(ref, () => ({
      close: () => {
        bottomSheetRef?.current?.close();
        setIsOpen(false);
      },
      open: () => {
        bottomSheetRef?.current?.expand();
        setIsOpen(true);
      },
      snapToIndex: (indexInner: number) => setIndex(indexInner),
      isOpen,
    }));

    const handleClose = (unmount: () => void) => {
      bottomSheetRef.current?.close();
      setIsOpen(false);

      setTimeout(() => {
        unmount();
      }, 400);
    };

    return (
      <>
        {isCustomTouch ? (
          <TouchComponent
            onPress={() => {
              bottomSheetRef.current?.expand();
              setIsOpen(true);
            }}
          />
        ) : (
          <TouchableOpacity
            onPress={() => {
              bottomSheetRef.current?.expand();
              setIsOpen(true);
            }}
            className="items-center"
          >
            <TouchComponent />
          </TouchableOpacity>
        )}
        <Portal
          key="portal"
          handleOnUnmount={unmount => {
            handleClose(unmount);
          }}
        >
          <BottomSheet
            ref={bottomSheetRef}
            enablePanDownToClose
            index={index}
            animationConfigs={{
              duration: 400,
            }}
            snapPoints={snapPointsThis}
            enableHandlePanningGesture={false}
            enableContentPanningGesture={false}
            // eslint-disable-next-line react/jsx-no-useless-fragment
            handleComponent={() => <></>}
            onClose={() => {
              setIsOpen(false);
            }}
            backdropComponent={useCallback(
              () => (
                <AnimatePresence exitBeforeEnter key="dsadsaaa">
                  {isOpen ? (
                    <MotiView
                      key="backdropsss"
                      from={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        flex: 1,
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                      }}
                    >
                      <Pressable
                        style={{
                          width: '100%',
                          height: '100%',
                          zIndex: 999,
                        }}
                      />
                    </MotiView>
                  ) : null}
                </AnimatePresence>
              ),
              [isOpen],
            )}
            backgroundStyle={{
              borderRadius: 0,
            }}
            style={{
              borderTopColor: '#2C2B2A',
              borderTopWidth: 0,
            }}
            {...rest}
          >
            <AnimatePresence exitBeforeEnter key="popp">
              {isOpen && children}
            </AnimatePresence>
            {/* <Toast config={toastConfig} key="hdsah" /> */}
          </BottomSheet>
        </Portal>
      </>
    );
  },
);

PortalBottomSheet.defaultProps = {
  snapPoints: ['100%'],
  isCustomTouch: false,
};

export default PortalBottomSheet;
