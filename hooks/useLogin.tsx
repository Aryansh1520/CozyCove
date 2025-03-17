import { useState , useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const useAuth = () => {
  
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const SERVER_URL = "https://physically-relaxing-baboon.ngrok-free.app"; // Put your server URL here

  const [pushToken, setPushToken] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
        const storedPushToken = await AsyncStorage.getItem("expoPushToken");
        setPushToken(storedPushToken);

    };
    fetchDetails();
}, []);
  const login = async (username, password) => {
    console.log(username,password)
    setLoading(true);
    try {
    const response = await fetch(`${SERVER_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, pushToken }), // Include pushToken
    });

      const data = await response.json();
      console.log(data)

      if (response.ok) {
        await AsyncStorage.setItem("userName", data.name);
        await AsyncStorage.setItem("role", data.role);
        await AsyncStorage.setItem("location", data.location);
        await AsyncStorage.setItem("isLoggedin", "true");

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
    try {
        const userName = await AsyncStorage.getItem("userName"); // Get the stored name

        if (!userName) {
            console.error("No user found in AsyncStorage.");
            return;
        }

        // Hit the logout endpoint
        const response = await fetch(`${SERVER_URL}/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: userName }), // Send userName as name
        });

        const data = await response.json();

        if (data.success) {
            console.log("Logout successful:", data.message);

            // Clear AsyncStorage only after successful logout
            await AsyncStorage.removeItem("userName");
            await AsyncStorage.removeItem("role");
            await AsyncStorage.removeItem("location");
            await AsyncStorage.setItem("isLoggedin", "false");

            // Redirect to login screen
            navigation.navigate("LoginScreen");
        } else {
            console.error("Logout failed:", data.message);
        }
    } catch (error) {
        console.error("Error during logout:", error);
    }
};
;

  return { login, logout, loading };
};

export default useAuth;
