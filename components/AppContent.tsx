import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { View, TouchableOpacity, Animated, Dimensions, AppState, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import '../global.css';
import * as NavigationBar from 'expo-navigation-bar';
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuth from 'hooks/useLogin';
import Home from './Home';
import ServerController from 'components/ServerController';
import ImageFeed from 'components/Ketinsta';
import Profile from 'components/Profile';
import ExitPopup from './ExitPopup';

// Memoize child components for better performance
const MemoizedHome = memo(Home);
const MemoizedImageFeed = memo(ImageFeed);
const MemoizedServerController = memo(ServerController);
const MemoizedProfile = memo(Profile);

type TabType = 'home' | 'goal' | 'settings' | 'profile';

const AppContent = () => {
    const navigation = useNavigation();
    const { logout } = useAuth();
    const lastNavBarState = useRef(false);
    const [activeTab, setActiveTab] = useState<TabType>('home');
    const screenWidth = Dimensions.get('window').width;
    const position = useRef(new Animated.Value(0)).current;
    const isAnimating = useRef(false);
    const navigationTimeout = useRef<NodeJS.Timeout | null>(null);
    const appState = useRef(AppState.currentState);
    const insets = useSafeAreaInsets();
    const [exitPopupVisible, setExitPopupVisible] = useState(false);
    
    // Combine these states to reduce re-renders
    const [dimensions, setDimensions] = useState({
        fullHeight: Dimensions.get('screen').height,
        navBarVisible: false
    });

    // Memoize handlers to prevent recreating functions on every render
    const handleBackPress = useCallback(() => {
        if (activeTab !== 'home') {
            handleTabPress('home');
        } else {
            setExitPopupVisible(true);
        }
        return true;
    }, [activeTab]);

    const updateLayoutHeight = useCallback(() => {
        setDimensions(prev => ({
            ...prev,
            fullHeight: Dimensions.get('screen').height
        }));
    }, []);

    const hideNavigationBar = useCallback(async () => {
        try {
            await NavigationBar.setVisibilityAsync('hidden');
            await NavigationBar.setBehaviorAsync('inset-swipe').catch(() => NavigationBar.setBehaviorAsync('inset'));
            setDimensions(prev => ({
                ...prev,
                navBarVisible: false
            }));
            setTimeout(updateLayoutHeight, 100);
        } catch (error) {
            // Silent error handling
        }
    }, [updateLayoutHeight]);

    const scheduleAutoHide = useCallback(() => {
        if (navigationTimeout.current) clearTimeout(navigationTimeout.current);
        navigationTimeout.current = setTimeout(() => hideNavigationBar(), 3000);
    }, [hideNavigationBar]);

    const checkNavigationBarVisibility = useCallback(async () => {
        try {
            const visibility = await NavigationBar.getVisibilityAsync();
            const isVisible = visibility !== 'hidden';
            if (isVisible !== lastNavBarState.current) {
                lastNavBarState.current = isVisible;
                setDimensions(prev => ({
                    ...prev,
                    navBarVisible: isVisible
                }));
                if (isVisible) scheduleAutoHide();
            }
        } catch (error) {
            // Silent error handling
        }
    }, [scheduleAutoHide]);

    // Setup back button handler
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackPress);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
        };
    }, [handleBackPress]);

    // Handle dimension changes
    useEffect(() => {
        updateLayoutHeight();
        const dimensionListener = Dimensions.addEventListener('change', updateLayoutHeight);
        return () => {
            dimensionListener.remove();
        };
    }, [updateLayoutHeight]);

    // Handle app state changes
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
    }, [checkNavigationBarVisibility, updateLayoutHeight]);

    // Navigation bar management - reduced interval frequency
    useEffect(() => {
        hideNavigationBar();
        // Reduced frequency to save battery
        const visibilityCheckInterval = setInterval(checkNavigationBarVisibility, 2000);
        return () => {
            clearInterval(visibilityCheckInterval);
            if (navigationTimeout.current) clearTimeout(navigationTimeout.current);
        };
    }, [hideNavigationBar, checkNavigationBarVisibility]);

    // Auto-hide nav bar when visible
    useEffect(() => {
        if (dimensions.navBarVisible) scheduleAutoHide();
    }, [dimensions.navBarVisible, scheduleAutoHide]);

    const handleTabPress = useCallback((tab: TabType) => {
        if (tab === activeTab || isAnimating.current) return;
        
        isAnimating.current = true;
        setActiveTab(tab);

        const toValue = ['home', 'goal', 'settings', 'profile'].indexOf(tab) * screenWidth;

        Animated.timing(position, {
            toValue,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            isAnimating.current = false;
        });
    }, [activeTab, position, screenWidth]);

    const handleExitApp = useCallback(() => {
        BackHandler.exitApp();
        setExitPopupVisible(false);
    }, []);

    // Memoize screen transition calculation
    const getScreenTranslateX = useCallback((index: number) => {
        return position.interpolate({
            inputRange: [0, screenWidth, screenWidth * 2, screenWidth * 3],
            outputRange: [0, -screenWidth, -screenWidth * 2, -screenWidth * 3].map(v => v + index * screenWidth),
            extrapolate: 'clamp',
        });
    }, [position, screenWidth]);

    const bottomTabHeight = insets.bottom + 16;
    const contentHeight = dimensions.fullHeight - bottomTabHeight - insets.top;

    // Calculate which screens should be rendered (current and adjacent for smooth animation)
    const shouldRenderScreen = (screen: TabType) => {
        const tabs: TabType[] = ['home', 'goal', 'settings', 'profile'];
        const activeIndex = tabs.indexOf(activeTab);
        const screenIndex = tabs.indexOf(screen);
        
        // Only render current screen and adjacent screens
        return Math.abs(activeIndex - screenIndex) <= 1;
    };

    return (
        <View style={{ flex: 1, paddingVertical: 2, backgroundColor: 'black', height: contentHeight, paddingBottom: insets.bottom }}>
            <ExitPopup 
                visible={exitPopupVisible} 
                onClose={() => setExitPopupVisible(false)} 
                onExit={handleExitApp} 
            />
            <View style={{ backgroundColor: 'black', width: '100%', height: contentHeight }}>
                {(['home', 'goal', 'settings', 'profile'] as TabType[]).map((screen, index) => (
                    <Animated.View 
                        key={screen}
                        style={{
                            position: 'absolute', 
                            width: '100%', 
                            top: 0, 
                            left: 0, 
                            height: contentHeight, 
                            backgroundColor: 'black', 
                            transform: [{ translateX: getScreenTranslateX(index) }], 
                            zIndex: activeTab === screen ? 2 : 1
                        }}
                    >
                        {shouldRenderScreen(screen) && (
                            <>
                                {screen === 'home' && <MemoizedHome />}
                                {screen === 'goal' && <MemoizedImageFeed />}
                                {screen === 'settings' && <MemoizedServerController />}
                                {screen === 'profile' && <MemoizedProfile />}
                            </>
                        )}
                    </Animated.View>
                ))}
            </View>

            <View style={{ bottom: 0, left: 0, width: '100%', backgroundColor: 'black', flexDirection: 'row', justifyContent: 'space-around', paddingBottom: insets.bottom + 10, height: 80 }}>
                {(['home', 'goal', 'settings', 'profile'] as TabType[]).map((screen, index) => (
                    <TouchableOpacity 
                        key={index} 
                        onPress={() => handleTabPress(screen)} 
                        onLongPress={hideNavigationBar}
                        activeOpacity={0.7}
                    >
                        <Icon 
                            name={['home', 'image-multiple', 'server', 'account'][index]} 
                            size={28} 
                            color={activeTab === screen ? 'white' : '#555'} 
                        />
                    </TouchableOpacity>
                ))}
            </View>
            <StatusBar style="light" />
        </View>
    );
};

export default React.memo(AppContent);