/* eslint-disable func-names */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@src/components/globals/Button';
import { globalStyle } from '@src/styles/globals';
import { hs, vs } from '@utils/design/design';
import { AnimatePresence, MotiView } from 'moti';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  LayoutAnimation,
  Platform,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { IExpandableCardContextType, IExpandableCardProps } from './types';

const ExpandableCardContext = createContext<IExpandableCardContextType>({
  expanded: false,
  isShowButton: false,
  buttonClick: () => {},
  toggleCard: () => {},
});

const ExpandableCard = (props: IExpandableCardProps) => {
  const {
    children,
    externalOpen,
    isShowButton,
    externalToggle,
    externalButtonClick,
  } = props;
  const [expanded, setExpanded] = useState(false);

  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const toggleCard = () => {
    externalToggle?.(!expanded);

    LayoutAnimation.configureNext({
      duration: 300,
      create: { type: 'easeIn', property: 'opacity' },
      update: { type: 'linear', springDamping: 0.3, duration: 250 },
    });
    setExpanded(!expanded);
  };

  const buttonClick = () => {
    externalButtonClick?.();
  };

  useEffect(() => {
    setExpanded(externalOpen || false);
  }, [externalOpen]);

  const contextValue = useMemo(
    () => ({
      expanded,
      isShowButton,
      toggleCard,
      buttonClick,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expanded, externalOpen],
  );

  return (
    <ExpandableCardContext.Provider value={contextValue}>
      {children}
    </ExpandableCardContext.Provider>
  );
};

const ExpandableCardHeader = React.memo(function ({ children }: any) {
  const { expanded, toggleCard } = useContext(ExpandableCardContext);
  return (
    !expanded && (
      <TouchableOpacity onPress={toggleCard}>
        <View
          pointerEvents="box-none"
          style={[
            globalStyle.whiteRoundedCard,
            { alignItems: 'flex-start', marginTop: vs(16) },
          ]}
        >
          {children}
        </View>
      </TouchableOpacity>
    )
  );
});

const ExpandableCardBody = React.memo(function ({ children }: any) {
  const { expanded, isShowButton, toggleCard, buttonClick } = useContext(
    ExpandableCardContext,
  );
  return (
    expanded && (
      <AnimatePresence exitBeforeEnter>
        <>
          <TouchableOpacity onPress={toggleCard}>
            <MotiView
              pointerEvents="box-none"
              key="account-type"
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -20 }}
              style={globalStyle.whiteRoundedCard}
            >
              {children}
            </MotiView>
          </TouchableOpacity>
          {isShowButton && (
            <View
              style={{
                marginLeft: hs(16),
                marginRight: hs(16),
                marginTop: vs(16),
                marginBottom: vs(16),
              }}
            >
              <Button btnTitle="Continue" onClick={buttonClick} />
            </View>
          )}
        </>
      </AnimatePresence>
    )
  );
});

ExpandableCard.Header = ExpandableCardHeader;
ExpandableCard.Body = ExpandableCardBody;

// ExpandableCard.defaultProps = {
//   containerStyles: {},
// };
export default ExpandableCard;
