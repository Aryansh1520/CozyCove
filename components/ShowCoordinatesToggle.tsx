import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, Dimensions, ActivityIndicator } from "react-native";
import { useToggleCoordinates } from "../hooks/useToggleCoordinates"; // Import the hook

const { width, height  } = Dimensions.get("window");

const ToggleSwitch = () => {
  const [isOn, setIsOn] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;

  // React Query mutation for toggling coordinates
  const { mutate: toggleCoordinates, isLoading } = useToggleCoordinates();

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOn ? height * 0.04 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOn]);

  const handleToggle = () => {
    if (isLoading) return; // Prevent multiple clicks while updating

    // Toggle locally for instant feedback
    setIsOn((prev) => !prev);

    // Send API request
    toggleCoordinates(!isOn, {
      onError: () => {
        setIsOn((prev) => !prev); // Revert if API fails
      },
    });
  };

  return (
    <View
      className="bg-[#141417] flex-row items-center justify-between px-5"
      style={{
        width: width * 0.96,
        height: height * 0.12 -5,
        borderRadius: 35,
        marginTop: height * 0.02,
      }}
    >
      {/* Left Side: Text */}
      <Text
        style={{
          fontFamily: "Inter_100Thin",
          fontSize: 16,
          color: "white",
          paddingLeft: 10,
        }}
      >
        Show Coordinates
      </Text>

      {/* Right Side: Toggle */}
      <TouchableOpacity onPress={handleToggle} activeOpacity={0.7} disabled={isLoading}>
        <View
          style={{
            width: height * 0.08,
            height: height * 0.04,
            borderRadius: 20,
            backgroundColor: isOn ? "#fc3400" : "#444",
            justifyContent: "center",
            padding: 2,
            position: "relative",
          }}
        >
          <Animated.View
            style={{
              width: height * 0.035,
              height: height * 0.035,
              borderRadius: 20,
              backgroundColor: "white",
              transform: [{ translateX }],
            }}
          />
          {isLoading && (
            <ActivityIndicator
              size="small"
              color="white"
              style={{ position: "absolute", alignSelf: "center" }}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ToggleSwitch;
