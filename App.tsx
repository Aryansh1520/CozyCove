import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, TouchableOpacity, Animated, Dimensions, StyleSheet, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ServerControlScreen from 'components/ServerController';
import ImageFeed from 'components/Ketinsta';
import Home from 'components/Home';
import './global.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as ExpoSplashScreen from 'expo-splash-screen';
import SplashScreen from './components/SplashScreen';

// Prevent the splash screen from automatically hiding
ExpoSplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'goal'>('home');
  const [activeScreen, setActiveScreen] = useState<'home' | 'goal'>('home');
  const screenWidth = Dimensions.get('window').width;
  const position = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  // Hide expo splash screen once our component mounts
  useEffect(() => {
    const hideSplash = async () => {
      await ExpoSplashScreen.hideAsync();
    };
    hideSplash();
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const animateToScreen = (screen: 'home' | 'goal') => {
    if (isAnimating.current) return;
    setActiveTab(screen);
    isAnimating.current = true;
    const toValue = screen === 'home' ? 0 : screenWidth;
    const duration = screen === 'home' ? 900 : 600; // Slower transition
    Animated.timing(position, {
      toValue,
      duration,
      easing: Easing.out(Easing.exp), // Corrected Easing reference
      useNativeDriver: true,
    }).start(() => {
      setActiveScreen(screen);
      isAnimating.current = false;
    });
  };

  const handlePress = (screen: 'home' | 'goal') => {
    if (screen !== activeTab) {
      animateToScreen(screen);
    }
  };

  const homeTranslateX = position.interpolate({
    inputRange: [0, screenWidth],
    outputRange: [0, -screenWidth],
    extrapolate: 'clamp',
  });

  const goalTranslateX = position.interpolate({
    inputRange: [0, screenWidth],
    outputRange: [screenWidth, 0],
    extrapolate: 'clamp',
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      position: 'relative',
      overflow: 'hidden',
    },
    screen: {
      position: 'absolute',
      width: screenWidth,
      height: '100%',
      top: 0,
      left: 0,
      backgroundColor: 'black',
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView className="flex-1 bg-black">
        {showSplash ? (
          <SplashScreen onFinish={handleSplashFinish} />
        ) : (
          <>
            <View style={styles.container}>
              <Animated.View
                style={[
                  styles.screen,
                  {
                    transform: [{ translateX: homeTranslateX }],
                    zIndex: activeTab === 'home' ? 2 : 1,
                  }
                ]}
              >
                <ServerControlScreen/>
              </Animated.View>
              {/* <Animated.View
                style={[
                  styles.screen,
                  {
                    transform: [{ translateX: goalTranslateX }],
                    zIndex: activeTab === 'goal' ? 2 : 1,
                  }
                ]}
              >
                <ImageFeed />
              </Animated.View> */}
            </View>
            <View className="absolute bottom-0 w-full bg-black flex-row justify-around py-2 rounded-[55]">
              <TouchableOpacity onPress={() => handlePress('home')}>
                <Icon name="home" size={30} color={activeTab === 'home' ? 'white' : '#555'} />
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => handlePress('goal')}>
                <Icon name="bullseye" size={30} color={activeTab === 'goal' ? 'white' : '#555'} />
              </TouchableOpacity> */}
            </View>
          </>
        )}
        <StatusBar style="auto" />
      </SafeAreaView>
    </QueryClientProvider>
  );
}