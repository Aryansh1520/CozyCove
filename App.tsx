import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, Dimensions, AppState } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ServerControlScreen from 'components/ServerController';
import ImageFeed from 'components/Ketinsta';
import Home from 'components/Home';
import './global.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CozyCoveAnimated from 'components/CozyCoveAnimated';
import SplashScreen from 'components/SplashScreen';
import ServerController from 'components/ServerController';

const queryClient = new QueryClient();

const AppContent = () => {
  const lastNavBarState = useRef(false); // Stores last known visibility
  const [activeTab, setActiveTab] = useState<'home' | 'goal'>('home');
  const [activeScreen, setActiveScreen] = useState<'home' | 'goal'>('home');
  const [debugMessages, setDebugMessages] = useState<string[]>([]);
  const [navBarVisible, setNavBarVisible] = useState(false);
  const [fullHeight, setFullHeight] = useState<number>(Dimensions.get('screen').height);
  const screenWidth = Dimensions.get('window').width;
  const position = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);
  const navigationTimeout = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);
  const insets = useSafeAreaInsets();
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800, // Smooth fade-out
        useNativeDriver: true,
      }).start(() => {
        setIsSplashVisible(false); // Ensure this runs after animation
      });
    }, 4000);
  }, []);
  
  
  // Function to update height on layout changes
  const updateLayoutHeight = () => {
    
    
    setFullHeight(Dimensions.get('screen').height);
  };
  
  // Add debug message function


  // Listen for dimension changes
  useEffect(() => {
    updateLayoutHeight();
    
    // Set up listener for dimension changes
    const dimensionListener = Dimensions.addEventListener('change', () => {
      updateLayoutHeight();
    });
    
    return () => {
      dimensionListener.remove();
    };
  }, []);

  // Function to hide the navigation bar
  const hideNavigationBar = async () => {
    try {
      //adddebugMessage("Hiding navigation bar");
      await NavigationBar.setVisibilityAsync('hidden');

      try {
        await NavigationBar.setBehaviorAsync('inset-swipe');
        //adddebugMessage("Set behavior to inset-swipe");
      } catch (behaviorError) {
        try {
          await NavigationBar.setBehaviorAsync('inset');
          //adddebugMessage("Set behavior to inset");
        } catch (innerError) {
          //adddebugMessage(`Couldn't set behavior: ${innerError}`);
        }
      }
      setNavBarVisible(false);
      //adddebugMessage("Navigation bar hidden successfully");
      setTimeout(updateLayoutHeight, 100);
    } catch (error) {
      //adddebugMessage(`Error hiding nav bar: ${error}`);
    }
  };
  const scheduleAutoHide = () => {
    //adddebugMessage("Scheduling auto-hide with 5 second delay");
    if (navigationTimeout.current) {
      clearTimeout(navigationTimeout.current);
      //adddebugMessage("Cleared existing timeout");
    }

    // Set new timeout for 5 seconds
    navigationTimeout.current = setTimeout(() => {
      //adddebugMessage("Auto-hide timeout triggered after 5 seconds");
      hideNavigationBar();
    }, 3000);
  };

  const checkNavigationBarVisibility = async () => {
    try {
      const visibility = await NavigationBar.getVisibilityAsync();
      const isVisible = visibility !== 'hidden';
  
      if (isVisible !== lastNavBarState.current) { 
        lastNavBarState.current = isVisible; 
        setNavBarVisible(isVisible);
        //adddebugMessage(`Navigation bar detected as ${isVisible ? 'visible' : 'hidden'}`);
  
        if (isVisible) {
          scheduleAutoHide(); 
          setTimeout(updateLayoutHeight, 100);
        }
      }
    } catch (error) {
      //adddebugMessage(`Error checking visibility: ${error}`);
    }
  };
    useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      //adddebugMessage(`App state changed from ${appState.current} to ${nextAppState}`);
      
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        //adddebugMessage("App returned to foreground");
        checkNavigationBarVisibility();
        updateLayoutHeight();
      }
      
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Set up initial hide and periodic visibility checking
  useEffect(() => {
    // First-time setup - hide the navigation bar
    hideNavigationBar();
    //adddebugMessage("Initial navigation bar hide called");

    // Set up periodic visibility checks instead of relying on listener
    const visibilityCheckInterval = setInterval(() => {
      checkNavigationBarVisibility();
    }, 1000); // Check more frequently since we don't have a direct listener

    // Set up a touch event detection system
    const touchDetectionInterval = setInterval(() => {
      // This is a simplified approach - we can't directly detect when system UI appears
      // but we can periodically check its state
      checkNavigationBarVisibility();
    }, 500);

    return () => {
      //adddebugMessage("Cleaning up navigation bar management");
      clearInterval(visibilityCheckInterval);
      clearInterval(touchDetectionInterval);

      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
    };
  }, []);

  // Listen for navigation bar visibility changes and update UI accordingly
  useEffect(() => {
    if (navBarVisible) {
      scheduleAutoHide();
    }
  }, [navBarVisible]);

  const animateToScreen = (screen: 'home' | 'goal') => {
    if (isAnimating.current) return;
    setActiveTab(screen);
    isAnimating.current = true;
    const toValue = screen === 'home' ? 0 : screenWidth;
    const duration = screen === 'home' ? 900 : 600;
    Animated.timing(position, {
      toValue,
      duration,
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

  // Calculate the bottom tab bar height
  const bottomTabHeight = insets.bottom + 16;
  
  // Calculate content height taking into account safe area insets
  const contentHeight = fullHeight - bottomTabHeight - insets.top;

  return (
      <View
        style={{
          flex: 1,
          paddingVertical: 2,
          backgroundColor: 'black',
          height: contentHeight,
          paddingBottom: insets.bottom, // Adjust for system navigation bar
        }}
      >

{isSplashVisible && (
        <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: fadeAnim,
            zIndex: 100,
          }}
        >
          < SplashScreen />
        </Animated.View>
      )}
        <View
          style={{
            backgroundColor: 'black',
            width: '100%',
            height: contentHeight,
          }}
        >
          <Animated.View
            style={{
              position: 'absolute',
              width: '100%',
              top: 0,
              left: 0,
              height: contentHeight,
              backgroundColor: 'black',
              transform: [{ translateX: homeTranslateX }],
              zIndex: activeTab === 'home' ? 2 : 1,
            }}
          >
            <ServerController />
          </Animated.View>
        </View>
  
        <View
          style={{
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'black',
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingBottom: insets.bottom + 10, // Adjust padding based on navigation bar
            height: 80,
          }}
        >
          <TouchableOpacity
            onPress={() => handlePress('home')}
            onLongPress={hideNavigationBar}
          >
            <Icon name="home" size={30} color={activeTab === 'home' ? 'white' : '#555'} />
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}