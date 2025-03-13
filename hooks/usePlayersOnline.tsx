import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { AppState } from "react-native";

const API_URL = "https://physically-relaxing-baboon.ngrok-free.app/players";

export const usePlayersOnline = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // Function to check login status from AsyncStorage
  const checkLoginStatus = async () => {
    const status = await AsyncStorage.getItem("isLoggedin");
    const loggedIn = status === "true";
    setIsLoggedIn(loggedIn);
    // console.log("isLoggedIn:", loggedIn);

    // Debugging: Print full AsyncStorage contents
    const allStorageKeys = await AsyncStorage.getAllKeys();
    const storageContents = await AsyncStorage.multiGet(allStorageKeys);
    // console.log("AsyncStorage Contents:", storageContents);
  };

  // Check login status on mount & when app state changes
  useEffect(() => {
    checkLoginStatus();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkLoginStatus();
      }
    });

    return () => subscription.remove();
  }, []);

  // Fetch login status before each request
  const query = useQuery({
    queryKey: ["playersOnline"],
    queryFn: async () => {
      await checkLoginStatus(); // Ensure latest login status before request

      // console.log("Fetching player count... isLoggedIn:", isLoggedIn);
      const response = await axios.get(API_URL);
      // console.log("Players Online:", response.data.data.playersOnline);
      return response.data.data.playersOnline;
    },
    enabled: isLoggedIn === true, // Fetch only if logged in
    refetchInterval: 9000, // Auto-refresh every 9 seconds
  });

  return isLoggedIn === null ? { isLoading: true } : query; // Prevents initial unnecessary fetches
};
