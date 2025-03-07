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

const { width, height } = Dimensions.get("window");

const ServerController = () => {
  const [status, setStatus] = useState("Offline");
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
          height: height * 0.45,
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
                Aryan Sharma
              </Text>
            </View>

            {/* Power Button with Pulsing Effect */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity>
                <Icon name="power" size={32} color="red" />
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
              {status}
            </Text>
          </View>

          {/* Bottom Buttons with Labels */}
          <View className="w-full mt-auto items-center">
            <View className="flex-row justify-between w-full">
              {[
                { icon: "cloud-upload", label: "Backup" },
                { icon: "restart", label: "Restart" },
                { icon: "backup-restore", label: "Reset" },
                { icon: "update", label: "Update" },
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
                    >
                      <Icon name={item.icon} size={20} color="white" />
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
    </SafeAreaView>
  );
};

export default ServerController;
