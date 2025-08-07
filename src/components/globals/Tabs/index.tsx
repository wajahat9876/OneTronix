/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text, TouchableOpacity } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { globalStyle } from '@src/styles/globals';
import { hs } from '@utils/design/design';
import { AnimatePresence, MotiView, View } from 'moti';
import { useMemo, useState } from 'react';
// import DynamicIcon from './DynamicIcon';
import { ITabsProps } from './types';

const Tabs = (props: ITabsProps) => {
  const { header, content } = props;
  const [tabIndex, setTabIndex] = useState<{
    activeTabIndex: number;
    previousTabIndex: number;
  }>({ activeTabIndex: 0, previousTabIndex: 0 });

  const getTranslateXFrom = () => {
    if (tabIndex.previousTabIndex < tabIndex.activeTabIndex) {
      return 100;
    }
    if (tabIndex.previousTabIndex === tabIndex.activeTabIndex) {
      return 100;
    }
    return -100;
  };

  const getTranslateXExit = () => {
    if (tabIndex.previousTabIndex > tabIndex.activeTabIndex) {
      return -100;
    }
    if (tabIndex.previousTabIndex === tabIndex.activeTabIndex) {
      return -100;
    }
    return 100;
  };

  const renderTabHeaders = useMemo(() => {
    return header.map((item, index) => {
      return (
        <TouchableOpacity
          key={item.label}
          onPress={() => {
            setTabIndex({
              activeTabIndex: index,
              previousTabIndex: tabIndex.activeTabIndex,
            });
          }}
        >
          <View
            style={
              tabIndex.activeTabIndex === index
                ? { borderColor: '#000F6C', borderWidth: 1.2 }
                : {}
            }
            className="flex-row items-center bg-white px-3 py-2 rounded-xl"
          >
            {/* <DynamicIcon
              type={item.iconType}
              name={item.iconName}
              size={20}
              color={
                tabIndex.activeTabIndex === index
                  ? Colors.light.theme.primaryColor
                  : Colors.light.tabBarInactiveColor
              }
            /> */}
            <Text
              style={{
                ...globalStyle.textMedium,
                fontSize: 15,
                padding: 6,
                color:
                  tabIndex.activeTabIndex === index
                    ? Colors.light.theme.primaryColor
                    : Colors.light.tabBarInactiveColor,
              }}
            >
              {item.label}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabIndex.activeTabIndex]);

  return (
    <View className="flex-1">
      <View
        className="flex-row w-full justify-between py-4"
        style={{ paddingLeft: hs(32), paddingRight: hs(32) }}
      >
        {renderTabHeaders}
      </View>

      <AnimatePresence exitBeforeEnter>
        <MotiView
          key={tabIndex.activeTabIndex}
          from={{
            opacity: 0,
            translateX: getTranslateXFrom(),
          }}
          transition={{
            type: 'timing',
          }}
          animate={{
            opacity: 1,
            translateX: 0,
          }}
          exit={{
            opacity: 0,
            translateX: getTranslateXExit(),
          }}
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
        >
          {content[tabIndex.activeTabIndex]}
        </MotiView>
      </AnimatePresence>
    </View>
  );
};

export default Tabs;
