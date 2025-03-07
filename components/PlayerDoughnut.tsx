import React, { useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  PanResponder,
  Animated,
} from "react-native";

const { width, height } = Dimensions.get("window");

const onlinePlayers = 2;
const totalPlayers = 20;
const radius = 30;
const innerRadius = 27; 
const segmentAngle = (2 * Math.PI) / totalPlayers; 

const PlayerDoughnut = () => {
  const rotation = useRef(new Animated.Value(0)).current; 
  const lastRotation = useRef(0); 
  const lastAngle = useRef(0); 

  
  const getAngle = (x, y) => {
    const dx = x - radius;
    const dy = y - radius;
    return Math.atan2(dy, dx); 
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        // Store initial touch angle
        const { locationX, locationY } = evt.nativeEvent;
        lastAngle.current = getAngle(locationX, locationY);
      },
      onPanResponderMove: (evt, gestureState) => {
        const { locationX, locationY } = evt.nativeEvent;
        const newAngle = getAngle(locationX, locationY);
        const angleDiff = (newAngle - lastAngle.current) * (180 / Math.PI); 

        lastAngle.current = newAngle; 
        const newRotation = lastRotation.current + angleDiff;
        rotation.setValue(newRotation);
      },
      onPanResponderRelease: (evt, gestureState) => {
        Animated.decay(rotation, {
          velocity: gestureState.vx * 5, 
          deceleration: 0.995, 
          useNativeDriver: true,
        }).start();

        lastRotation.current += (lastAngle.current * 180) / Math.PI; 
      },
    })
  ).current;

  return (
    <View
      className="bg-[#141417] flex-row items-center p-5"
      style={{
        width: width * 0.96,
        height: height * 0.15,
        borderRadius: 45,
        marginTop: height * 0.02,
      }}
    >
      {/* Left Side - Player Info */}
      <View style={{ flex: 1, paddingLeft: 10 }}>
        <Text
          style={{
            fontFamily: "Inter_100Thin",
            fontSize: 14,
            color: "white",
          }}
        >
          Players Online
        </Text>
        <Text
          style={{
            fontFamily: "Inter_100Thin",
            fontSize: 32,
            color: "white",
          }}
        >
          {onlinePlayers} / {totalPlayers}
        </Text>
      </View>

      {/* Right Side - Rotating Doughnut */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          width: radius * 2,
          height: radius * 2,
          borderRadius: radius,
          position: "relative",
          backgroundColor: "transparent",
          transform: [
            {
              rotate: rotation.interpolate({
                inputRange: [-360, 360],
                outputRange: ["-360deg", "360deg"],
              }),
            },
          ],
        }}
      >
        {/* Generating segments dynamically */}
        {[...Array(totalPlayers)].map((_, i) => {
          const isFilled = i < onlinePlayers;
          const angle = i * segmentAngle;
          const x = Math.cos(angle) * radius + radius;
          const y = Math.sin(angle) * radius + radius;

          return (
            <Animated.View
              key={i}
              style={{
                position: "absolute",
                width: 10,
                height: 10,
                backgroundColor: isFilled ? "#fc3400" : "#444",
                borderRadius: 5,
                left: x - 5,
                top: y - 5,
              }}
            />
          );
        })}

        {/* Center Cutout */}
        <View
          style={{
            position: "absolute",
            width: innerRadius * 2,
            height: innerRadius * 2,
            borderRadius: innerRadius,
            backgroundColor: "#141417",
            top: radius - innerRadius,
            left: radius - innerRadius,
          }}
        />
      </Animated.View>
    </View>
  );
};

export default PlayerDoughnut;
