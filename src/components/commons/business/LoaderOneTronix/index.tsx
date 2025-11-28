// src/components/Loader.tsx
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

type LoaderProps = {
  visible: boolean;
  message?: string;
};

export default function Loader({ visible, message }: LoaderProps) {
  const [internalVisible, setInternalVisible] = useState(visible);

  useEffect(() => {
    setInternalVisible(visible); // sync with prop

    if (!visible) return;

    // auto hide after 20 seconds max
    const timer = setTimeout(() => {
      setInternalVisible(false);
    }, 20000);

    return () => clearTimeout(timer);
  }, [visible]);

  if (!internalVisible) return null;
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
      onRequestClose={() => {}} // Required for Android
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0a84ff" />
          {message ? <Text style={styles.text}>{message}</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
});
