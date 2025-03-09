import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Dimensions, Easing } from "react-native";
import { useChangeGamemode } from "../hooks/useChangeGameMode"; // Import your hook

const { width, height } = Dimensions.get("window");

const gameModes = [
  { label: "Survival", icon: "🛡️", value: "survival" },
  { label: "Creative", icon: "🎨", value: "creative" },
  { label: "Adventure", icon: "🏹", value: "adventure" },
  { label: "Spectator", icon: "👀", value: "spectator" },
];

const GameModeSelector = () => {
  const [selectedMode, setSelectedMode] = useState("Survival");

  // Hook to send game mode change request
  const { mutate: changeGamemode, isLoading } = useChangeGamemode();

  // Animated values for each button
  const animatedScales = useRef(
    gameModes.reduce((acc, mode) => {
      acc[mode.label] = new Animated.Value(mode.label === "Survival" ? 1 : 0);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;

  // Animated value for fading text
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleSelect = (modeLabel: string, modeValue: string) => {
    if (modeLabel === selectedMode || isLoading) return; // Prevent redundant animation & disable when loading

    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setSelectedMode(modeLabel); // Change text after fade-out

      // Fade-in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });

    gameModes.forEach(({ label }) => {
      Animated.timing(animatedScales[label], {
        toValue: label === modeLabel ? 1 : 0, // Scale to 1 for selected, 0 for deselected
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    // Send game mode change request
    changeGamemode(modeValue);
  };

  return (
    <View
      className="bg-[#141417] items-center p-5"
      style={{
        width: width * 0.96,
        height: height * 0.18,
        borderRadius: 45,
        marginTop: height * 0.02,
      }}
    >
      {/* Title */}
      <Text style={{ fontFamily: "Inter_100Thin", fontSize: 14, color: "white" }}>Game Mode</Text>

      {/* Game Mode Options */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", marginTop: 10 }}>
        {gameModes.map(({ label, icon, value }) => {
          return (
            <TouchableOpacity key={label} onPress={() => handleSelect(label, value)} activeOpacity={0.8}>
              <View
                style={{
                  width: 55,
                  height: 55,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  backgroundColor: "rgba(255, 255, 255, 0.1)", // Default background
                }}
              >
                {/* Expanding Circle Animation */}
                <Animated.View
                  style={{
                    position: "absolute",
                    width: 55,
                    height: 55,
                    borderRadius: 30,
                    backgroundColor: "#fc3400",
                    transform: [{ scale: animatedScales[label] }],
                    opacity: animatedScales[label],
                  }}
                />
                <Text style={{ fontSize: 24, zIndex: 1 }}>{icon}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Animated Selected Mode Text */}
      <Animated.Text
        style={{
          fontFamily: "Inter_100Thin",
          fontSize: 16,
          color: "#B0B0B0",
          marginTop: 10,
          opacity: fadeAnim, // Fades in and out
          transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [5, 0] }) }], // Smooth vertical movement
        }}
      >
        {isLoading ? "Changing..." : selectedMode}
      </Animated.Text>
    </View>
  );
};

export default GameModeSelector;
