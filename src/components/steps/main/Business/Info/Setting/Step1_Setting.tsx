/* eslint-disable camelcase */
/* eslint-disable import/order */
import ScreenAuth from "@src/components/globals/ScreenAuth";
import { pageTransitionAnimation } from "@src/constants/Animation";
import Colors from "@src/constants/Colors";
import { MultiStepFormProps } from "@src/hooks/useMultiStepForm";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

const TABS = [
  { key: "Battery", label: "Battery" },
  { key: "Charging Source", label: "Charging Source" },
  { key: "Heavy Load", label: "Heavy Load" },
  { key: "Inverter", label: "Inverter" },
  { key: "Misc", label: "Misc" },
  { key: "Solar", label: "Solar" },
  { key: "Utility", label: "Utility" },
  { key: "Utility Control", label: "Utility Control" },
];

const Step1_Setting = ({ back }: MultiStepFormProps) => {
  const [selectedTab, setSelectedTab] = useState("Battery");

  const renderContent = () => {
    switch (selectedTab) {
      case "Battery":
        return <Text style={styles.tabContentText}>General Settings Data</Text>;
      case "Charging Source":
        return (
          <Text style={styles.tabContentText}>Battery Configuration Data</Text>
        );
      case "Heavy Load":
        return <Text style={styles.tabContentText}>WiFi Settings Data</Text>;
      case "Inverter":
        return <Text style={styles.tabContentText}>Grid Setup Data</Text>;
      case "Misc":
        return (
          <Text style={styles.tabContentText}>System Information Data</Text>
        );
      case "Solar":
        return (
          <Text style={styles.tabContentText}>System Information Data</Text>
        );
      case "Utility":
        return (
          <Text style={styles.tabContentText}>System Information Data</Text>
        );
      case "Utility Control":
        return (
          <Text style={styles.tabContentText}>System Information Data</Text>
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View
      {...pageTransitionAnimation}
      key="transfer_money"
      style={styles.container}
    >
      <ScreenAuth
        title="Inverter Setting"
        style={styles.screenAuthStyle}
        topColor={Colors.light.theme.backgroundTopCurveSection}
        bottomColor={Colors.light.theme.backgroundTopCurveSection}
        darkStatus
        appBarProps={{
          light: true,
          rightIcon: true,
        }}
        back={() => back?.()}
      >
        {/* Everything inside same screen layout */}
        <View style={styles.innerContainer}>
          {/* Horizontal Scroll Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
          >
            {TABS.map((tab) => {
              const isActive = selectedTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabButton, isActive && styles.activeTabButton]}
                  onPress={() => setSelectedTab(tab.key)}
                >
                  <Text
                    style={[styles.tabText, isActive && styles.activeTabText]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Show selected tab data inside same screen */}
          {renderContent()}
        </View>
      </ScreenAuth>
    </Animated.View>
  );
};

export default Step1_Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  screenAuthStyle: {
    backgroundColor: Colors.light.theme.backgroundTopCurveSection,
  },
  innerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  tabsContainer: {
    paddingVertical: 8,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: "#f1f1f1",
    marginRight: 10,
  },
  activeTabButton: {
    backgroundColor: "green",
  },
  tabText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: "white",
  },
  tabContentText: {
    fontSize: 16,
    color: "#444",
    marginTop: 20,
  },
});
