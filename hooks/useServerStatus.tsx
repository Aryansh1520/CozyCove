import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { AppState } from "react-native";

const API_URL = "https://physically-relaxing-baboon.ngrok-free.app/status";

export const useServerStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // Function to check login status from AsyncStorage
  const checkLoginStatus = async () => {
    const status = await AsyncStorage.getItem("isLoggedin");
    const loggedIn = status === "true";
    setIsLoggedIn(loggedIn);
    // console.log("isLoggedIn:", loggedIn); // Debugging log

    // Print AsyncStorage contents
    const allStorage = await AsyncStorage.getAllKeys();
    const storageContents = await AsyncStorage.multiGet(allStorage);
    //console.log("AsyncStorage Contents:", storageContents);
  };

  // Run checkLoginStatus on mount and when app state changes
  useEffect(() => {
    checkLoginStatus();

    // Listen for app state changes (foreground/background)
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkLoginStatus(); // Refresh when the app comes back to foreground
      }
    });

    return () => subscription.remove(); // Cleanup
  }, []);

  // Fetch login status every time before making a request
  const query = useQuery({
    queryKey: ["serverStatus"],
    queryFn: async () => {
      await checkLoginStatus(); // Force check before each request

      // console.log("Fetching server status... isLoggedIn:", isLoggedIn);
      const response = await axios.get(API_URL);
      // console.log("Server Status:", response.data.status);
      return response.data.status;
    },
    enabled: isLoggedIn === true, // Only fetch if logged in
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  return isLoggedIn === null ? { isLoading: true } : query; // Prevent unnecessary fetches
};
