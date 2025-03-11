import React, { useState, useRef, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AppNavigator from 'components/AppNavigator';
import { NavigationContainer } from "@react-navigation/native";
import './global.css';

const queryClient = new QueryClient();


export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AppNavigator />
        </QueryClientProvider>
      </SafeAreaProvider>
    </NavigationContainer>
    
  );
}