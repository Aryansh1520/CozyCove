import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Inter_300Light, Inter_600SemiBold, Inter_700Bold, Inter_100Thin } from "@expo-google-fonts/inter";
import AppLoading from "expo-app-loading";
import PlayerDoughnut from "./PlayerDoughnut";
import GameModeSelector from "./GameModeSelector";
import ShowCoordinatesToggle from "./ShowCoordinatesToggle";
import { useServerStatus } from "../hooks/useServerStatus";
import { useStartServer } from "../hooks/useStartServer";
import { useStopServer } from "hooks/useStopServer";
import { useBackupServer } from "hooks/useBackupServer";
import { useRestartServer } from "hooks/useRestartServer";
import { useUpdateServer } from "hooks/useUpdateServer";

const { width, height } = Dimensions.get("screen");
import { useQueryClient } from "@tanstack/react-query";
const ServerController = () => {
  let [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_100Thin,
  });

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fading in the server card
  const pulseAnim = useRef(new Animated.Value(1)).current; // For pulsing the power button
  const bounceAnim = useRef(new Animated.Value(1)).current; // For button press effect
  const slideAnim = useRef(new Animated.Value(100)).current; // For sliding in bottom components

  const { mutate: startServer, isPending: isStarting } = useStartServer();
  const { mutate: stopServer, isPending: isStopping } = useStopServer();
  const { data: status, isLoading: isChecking } = useServerStatus();
  const [localStatus, setLocalStatus] = useState(status); // ✅ Temporary local state
  
  // ✅ Keep local status in sync with actual status
  useEffect(() => {
    if (!isStarting && !isStopping) {
      setLocalStatus(status);
    }
  }, [status, isStarting, isStopping]);
  
  const isOnline = localStatus === "Online"; // ✅ Correctly reflect server status
  
  const [localOnline, setLocalOnline] = useState(isOnline); // ✅ Instant state update
  const queryClient = useQueryClient(); // ✅ React Query client
  
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  
    if (isOnline) {
      setLocalOnline(false); // ✅ Instantly update the UI
      stopServer(undefined, {
        onSettled: () => queryClient.invalidateQueries(["serverStatus"]), // ✅ Force status refresh
      });
    } else {
      setLocalOnline(true); // ✅ Instantly update the UI
      startServer(undefined, {
        onSettled: () => queryClient.invalidateQueries(["serverStatus"]), // ✅ Force status refresh
      });
    }
  };


  const { mutate: restartServer, isPending: isRestarting } = useRestartServer();
const { mutate: backupServer, isPending: isBackingUp } = useBackupServer();
const { mutate: updateServer, isPending: isUpdating } = useUpdateServer();

const handleRestart = () => {
  restartServer(undefined, {
    onSettled: () => {
      queryClient.invalidateQueries(["serverStatus"]);
    },
  });
};

const handleBackup = () => {
  backupServer();
};

const handleUpdate = () => {
  updateServer();
};
    
  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    // Pulse effect for power button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Slide in PlayerDoughnut and GameModeSelector
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(bounceAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(bounceAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#000] items-center p-2">
      {/* Status Bar Customization */}
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      {/* Server Card with Gradient Background */}
      <Animated.View
        style={{
          width: width * 0.96,
          height: height * 0.38,
          marginTop: height * 0.05,
          borderRadius: 45,
          overflow: "hidden",
          opacity: fadeAnim, // Fade-in effect
        }}
      >
        <LinearGradient
          colors={["#FFFFFF", "#4169E1", "#1E3A8A", "#121212", "#000000"]}
          locations={[0, 0.1, 0.2, 0.55, 1]}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{ flex: 1, padding: 20 }}
        >
          {/* Top Row */}
          <View className="flex-row justify-between items-center w-full mb-5">
            {/* Profile Section */}
            <View className="flex-row items-center">
              <Image
                source={{ uri: "https://via.placeholder.com/50" }}
                className="w-12 h-12 rounded-full"
              />
              <Text
                style={{
                  fontFamily: "Inter_300Light",
                  fontSize: 18,
                  color: "white",
                  marginLeft: 10,
                }}
              >
                Keta Madhani
              </Text>
            </View>

            {/* Power Button with Pulsing Effect */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
  <TouchableOpacity 
    onPress={handlePress} 
    disabled={ isStarting || isStopping} // ✅ Only disable during API request
  >
    <Icon 
      name={localOnline ? "power-off" : "power"}  // ✅ Uses local state for instant update
      size={32} 
      color={ isStopping ? "gray" : localOnline ? "green" : "red"} 
    />
  </TouchableOpacity>
</Animated.View>

          </View>

          {/* Server Status */}
          <View className="w-full pt-8">
      <Text
        style={{
          fontFamily: "Inter_300Light",
          fontSize: 14,
          color: "#B0B0B0",
          marginBottom: 5,
        }}
      >
        Server Status:
      </Text>
      <Text
        style={{
          fontFamily: "Inter_100Thin",
          fontSize: 55,
          color: "white",
          marginTop: 5,
        }}
      >
{isChecking ? "Checking..." : status ?? "Offline"}
</Text>
    </View>

          {/* Bottom Buttons with Labels */}
          <View className="w-full mt-auto items-center">
    <View className="flex-row justify-between w-full">
      {[
        { icon: "cloud-upload", label: "Backup", action: handleBackup, isLoading: isBackingUp },
        { icon: "restart", label: "Restart", action: handleRestart, isLoading: isRestarting },
        { icon: "backup-restore", label: "Reset", action: () => console.log("Reset action") },
        { icon: "update", label: "Update", action: handleUpdate, isLoading: isUpdating },
      ].map((item, index) => (
        <View key={index} className="items-center">
          <Animated.View
            style={{
              transform: [{ scale: bounceAnim }],
            }}
          >
            <TouchableOpacity
              className="rounded-full flex items-center justify-center"
              style={{
                width: 55,
                height: 55,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={item.action}
              disabled={item.isLoading}
            >
              <Icon name={item.icon} size={20} color={item.isLoading ? "gray" : "white"} />
            </TouchableOpacity>
          </Animated.View>
          <Text
            style={{
              fontFamily: "Inter_300Light",
              fontSize: 12,
              color: "#B0B0B0",
              marginTop: 5,
            }}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  </View>

        </LinearGradient>
      </Animated.View>

      {/* Player Doughnut Chart with Slide Animation */}
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        <PlayerDoughnut />
      </Animated.View>

      {/* Game Mode Selector with Slide Animation */}
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        <GameModeSelector />
      </Animated.View>
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        <ShowCoordinatesToggle/>
      </Animated.View>


    </SafeAreaView>
  );
};

export default ServerController;
