import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const useAuth = () => {
  
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const SERVER_URL = "https://physically-relaxing-baboon.ngrok-free.app"; // Put your server URL here

  const login = async (username, password) => {
    console.log(username,password)
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(data)

      if (response.ok) {
        await AsyncStorage.setItem("userName", data.name);
        navigation.navigate("AppContent"); // Navigate to ServerController
      } else {
        Alert.alert("Login Failed", data.message);
      }
    } catch (error) {
      console.log("Error" , error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userName");
    navigation.navigate("LoginScreen"); // Redirect to login screen after logout
  };

  return { login, logout, loading };
};

export default useAuth;
