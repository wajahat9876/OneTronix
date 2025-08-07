/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from 'react-native';
import { IAccordionContextType, IAccordionProps } from './types';

const AccordionContext = createContext<IAccordionContextType>({
  opened: false,
  toggleAccordion: () => {},
});

const Accordion = ({
  children,
  containerStyles,
  externalOpen,
  externalToggle,
}: IAccordionProps) => {
  const [opened, setOpened] = useState(false);

  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const toggleAccordion = () => {
    externalToggle?.(!opened);

    LayoutAnimation.configureNext({
      duration: 200,
      create: { type: 'easeIn', property: 'opacity' },
      update: { type: 'linear', springDamping: 0.3, duration: 100 },
    });

    setOpened(!opened);
  };

  useEffect(() => {
    setOpened(externalOpen || false);
    // toggleAccordion()
  }, [externalOpen]);

  const contextValue = useMemo(
    () => ({
      opened,
      toggleAccordion,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [opened, externalOpen],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <View style={{ ...styles.container, ...containerStyles }}>
        {children}
      </View>
    </AccordionContext.Provider>
  );
};

Accordion.Header = function ({ children }: any) {
  const { toggleAccordion } = useContext(AccordionContext);

  return (
    // !opened && (
    <TouchableWithoutFeedback onPress={toggleAccordion}>
      <View style={styles.header}>
        {children}
        {/* {!hideHeaderLogo && <Icons iconType={iconType} opened={opened} />} */}
      </View>
    </TouchableWithoutFeedback>
    // )
  );
};

Accordion.Body = function ({ children }: any) {
  const { opened, toggleAccordion } = useContext(AccordionContext);
  return opened ? (
    <TouchableWithoutFeedback onPress={toggleAccordion} style={styles.content}>
      {children}
    </TouchableWithoutFeedback>
  ) : null;
};

// Accordion.defaultProps = {
//   containerStyles: {},
// };

const styles = StyleSheet.create({
  content: {
    marginTop: 8,
  },
  container: {
    // margin: 10,
    // paddingTop: 8,
    // paddingBottom: 8,
    // borderRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Accordion;
