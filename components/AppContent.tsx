import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, Dimensions, AppState , BackHandler ,Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageFeed from 'components/Ketinsta';
import '../global.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as NavigationBar from 'expo-navigation-bar';
import { useNavigation } from "@react-navigation/native";
import {  useSafeAreaInsets } from 'react-native-safe-area-context';
import ServerController from 'components/ServerController';
import AsyncStorage from "@react-native-async-storage/async-storage"; // Storing login state
import useAuth from 'hooks/useLogin';

const queryClient = new QueryClient();
 // Use the logout function
const AppContent = () => {
    const navigation = useNavigation();
const { logout } = useAuth();
    const lastNavBarState = useRef(false); // Stores last known visibility
    const [activeTab, setActiveTab] = useState<'home' | 'goal'>('home');
    const [activeScreen, setActiveScreen] = useState<'home' | 'goal'>('home');
    const [navBarVisible, setNavBarVisible] = useState(false);
    const [fullHeight, setFullHeight] = useState<number>(Dimensions.get('screen').height);
    const screenWidth = Dimensions.get('window').width;
    const position = useRef(new Animated.Value(0)).current;
    const isAnimating = useRef(false);
    const navigationTimeout = useRef<NodeJS.Timeout | null>(null);
    const appState = useRef(AppState.currentState);
    const insets = useSafeAreaInsets();  


    useEffect(() => {
        const onBackPress = () => {
            Alert.alert(
                "Logout",
                "Are you sure you want to logout?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Yes",
                        onPress: () => logout(),
                    },
                ],
                { cancelable: false }
            );
            return true; // Prevent default back action
        };

        // Add event listener
        BackHandler.addEventListener("hardwareBackPress", onBackPress);

        // Cleanup listener when component unmounts
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        };
    }, []);



    const updateLayoutHeight = () => {
      setFullHeight(Dimensions.get('screen').height);
    };
    useEffect(() => {
      updateLayoutHeight();

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
        await NavigationBar.setVisibilityAsync('hidden');
  
        try {
          await NavigationBar.setBehaviorAsync('inset-swipe');
        } catch (behaviorError) {
          try {
            await NavigationBar.setBehaviorAsync('inset');
          } catch (innerError) {
          }
        }
        setNavBarVisible(false);
        setTimeout(updateLayoutHeight, 100);
      } catch (error) {
      }
    };
    const scheduleAutoHide = () => {
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
  
      // Set new timeout for 3 seconds
      navigationTimeout.current = setTimeout(() => {
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
    
          if (isVisible) {
            scheduleAutoHide(); 
            setTimeout(updateLayoutHeight, 100);
          }
        }
      } catch (error) {
      }
    };
    
    useEffect(() => {
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
          checkNavigationBarVisibility();
          updateLayoutHeight();
        }
        appState.current = nextAppState;
      });
  
      return () => {
        subscription.remove();
      };
    }, []);
    useEffect(() => {
      hideNavigationBar();
      const visibilityCheckInterval = setInterval(() => {
        checkNavigationBarVisibility();
      }, 1000); 
      const touchDetectionInterval = setInterval(() => {
        checkNavigationBarVisibility();
      }, 500);
  
      return () => {
        clearInterval(visibilityCheckInterval);
        clearInterval(touchDetectionInterval);
  
        if (navigationTimeout.current) {
          clearTimeout(navigationTimeout.current);
        }
      };
    }, []);
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

    const bottomTabHeight = insets.bottom + 16;

    const contentHeight = fullHeight - bottomTabHeight - insets.top;
  
    return (
      <View
        style={{
          flex: 1,
          paddingVertical: 2,
          backgroundColor: 'black',
          height: contentHeight,
          paddingBottom: insets.bottom,
        }}
      >

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
            paddingBottom: insets.bottom + 10,
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
  
  export default AppContent;