import React, { useState, useRef, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AppNavigator from 'components/AppNavigator';
import { NavigationContainer } from "@react-navigation/native";
import './global.css';
import messaging from '@react-native-firebase/messaging';


const queryClient = new QueryClient();

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}


const getToken = async() => {
  const token = await messaging().getToken()
  console.log(token)
}

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