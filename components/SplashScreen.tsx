import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Dimensions, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import AppLoading from "expo-app-loading";
import { useFonts, Inter_300Light, Inter_600SemiBold, Inter_700Bold, Inter_100Thin } from "@expo-google-fonts/inter";

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get("window");

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
    let [fontsLoaded] = useFonts({
      Inter_300Light,
      Inter_600SemiBold,
      Inter_700Bold,
      Inter_100Thin,
    });

  useEffect(() => {
    // Start animations after a short delay
    const timer = setTimeout(() => {
      animateSplashScreen();
    }, 3000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const animateSplashScreen = () => {
    // Sequence of animations
    Animated.sequence([
      // First scale up slightly
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),

      // Then scale down and fade out simultaneously
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // When animation completes, call the onFinish callback
      onFinish();
    });
  };
  if (!fontsLoaded) {
    return <AppLoading />;
  }


  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Animated.View
        style={[
          styles.splashContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Title and Subtitle */}
        <Text style={styles.title}>Hello Keta 🐱😘</Text>
        <Text style={styles.subtitle}>Loading your experience...</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width, // Full width
    height: height, // Full height
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  splashContainer: {
    width: width * 0.8, // 80% of screen width
    height: height * 0.3, // 30% of screen height
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Inter_100Thin",
    fontSize: width * 0.08, // Dynamic font size (8% of screen width)
    color: "#FFFFFF",
    marginBottom: height * 0.02, // 2% of screen height
  },
  subtitle: {
    fontFamily: "Inter_100Thin",
    fontSize: width * 0.04, // 4% of screen width
    color: "#BBBBBB",
  },
});

export default SplashScreen;
