/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface GlobalWebViewProps {
  uri: string;
}
const GlobalWebView = ({ uri }: GlobalWebViewProps) => {
  return (
    <WebView
      containerStyle={{ flex: 1 }}
      source={{ uri }}
      startInLoadingState
      renderLoading={() => (
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'white',
          }}
        >
          <ActivityIndicator color="blue" size="large" />
        </View>
      )}
    />
  );
};

const styles = {
  loaderContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
};

export default GlobalWebView;
