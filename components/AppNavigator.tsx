import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Storing login state
import { View, ActivityIndicator } from "react-native";

import LoginScreen from "./LoginComponent";
import ServerController from "./ServerController";
import SplashScreen from "./SplashScreen";
import AppContent from "./AppContent";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashHandler} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="AppContent" component={AppContent} />
        <Stack.Screen name="ServerController" component={ServerController} />
      </Stack.Navigator>
  );
}

// 🔹 Custom Splash Handler Component to manage redirection
const SplashHandler = ({ navigation }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
        // Wait for 4.5 seconds (Splash Screen Delay)
        await new Promise((resolve) => setTimeout(resolve, 4500));
      
        try {
          // Check if userName exists in AsyncStorage
          const userName = await AsyncStorage.getItem("userName");
      
          // Navigate based on the presence of userName
          if (userName) {
            navigation.navigate("AppContent");
          } else {
            navigation.navigate("LoginScreen");
          }
        } catch (error) {
          console.error("Error checking login status:", error);
          navigation.navigate("LoginScreen"); // Default to login if there's an error
        }
      };
      

    checkLoginStatus();
  }, [navigation]);

  return <SplashScreen />;
};
