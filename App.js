import 'react-native-gesture-handler';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';

import Navigation from './src/Navigation';

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <Provider store={store}>
        <Navigation />
      </Provider>
    </GluestackUIProvider>
  );
}
