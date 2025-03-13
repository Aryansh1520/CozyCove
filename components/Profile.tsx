import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import useAuth from "hooks/useLogin";
import { useFonts, Inter_300Light, Inter_600SemiBold, Inter_700Bold, Inter_100Thin } from "@expo-google-fonts/inter";
import LogoutPopup from "./LogoutPopup"; // Make sure to create this component separately

const { height } = Dimensions.get('screen');

const Profile = () => {
    const { logout } = useAuth();
    const insets = useSafeAreaInsets();
    const [userName, setUserName] = useState(null);
    const [role, setRole] = useState(null);
    const [location, setLocation] = useState(null);
    const [logoutPopupVisible, setLogoutPopupVisible] = useState(false); // Added state for logout popup

    let [fontsLoaded] = useFonts({ Inter_300Light, Inter_600SemiBold, Inter_700Bold, Inter_100Thin });

    useEffect(() => {
        const fetchDetails = async () => {
            const storedUserName = await AsyncStorage.getItem("userName");
            const storedRole = await AsyncStorage.getItem("role");
            const storedlocation = await AsyncStorage.getItem("location");

            setUserName(storedUserName);
            setRole(storedRole);
            setLocation(storedlocation);
        };
        fetchDetails();
    }, []);

    // Handle showing the logout popup
    const handleLogoutPress = () => {
        setLogoutPopupVisible(true);
    };

    // Handle confirming logout action
    const handleConfirmLogout = () => {
        setLogoutPopupVisible(false);
        logout();
    };

    if (!fontsLoaded) return null; // Wait for fonts to load

    return (
        <View className="flex-1 bg-black items-center" style={{ paddingTop: insets.top, height }}>
            {/* Logout Popup */}
            <LogoutPopup 
                visible={logoutPopupVisible} 
                onClose={() => setLogoutPopupVisible(false)} 
                onLogout={handleConfirmLogout} 
            />
            
            {/* Profile Image */}
            <View
                style={{
                    width: "96%",
                    height: height * 0.38,
                    marginTop: "5%",
                    borderRadius: 45,
                    overflow: "hidden", 
                }}
            >
                <Image
                    source="https://placehold.co/368x316"
                    style={{ width: "100%", height: "100%" }}
                    transition={300}
                />
            </View>

            {/* Profile Details Card */}
            <View className="bg-[#141417] rounded-2xl p-6 mx-4 mt-6 w-[90%]">
                <Text style={[styles.nameText]}>{userName || "User"}</Text>
                <View className="flex-row items-center mt-1">
                    <Icon name="briefcase-outline" size={16} color="gray" />
                    <Text style={[styles.jobTitle]} className="pb-1 pl-2">{role}</Text>
                </View>
                <View className="flex-row items-center mt-1">
                    <Icon name="map-marker-outline" size={16} color="gray" />
                    <Text style={[styles.locationText]} className="pl-1">{location}</Text>
                </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-between w-[90%] mt-6">
                <TouchableOpacity className="flex-1 bg-white p-4 rounded-xl flex-row items-center justify-center mr-2">
                    <Icon name="pencil-outline" size={24} color="black" />
                    <Text style={[styles.buttonText]}>Update Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    className="flex-1 bg-red-600 p-4 rounded-xl flex-row items-center justify-center ml-2"
                    onPress={handleLogoutPress} // Changed to show popup instead of direct logout
                >
                    <Icon name="logout" size={24} color="white" />
                    <Text style={[styles.buttonText, { color: "white" }]}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <Text style={[styles.footerText]}>
                Made with ❤️ by <Text style={[styles.footerHighlight]}>Aryan Sharma</Text>
            </Text>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    nameText: {
        color: "white",
        fontSize: 24,
        fontFamily: "Inter_300Light",
    },
    jobTitle: {
        color: "#a1a1a1",
        fontSize: 14,
        fontFamily: "Inter_300Light",
        marginTop: 4,
    },
    locationText: {
        color: "#a1a1a1",
        fontSize: 12,
        fontFamily: "Inter_100Thin",
        marginLeft: 4,
    },
    buttonText: {
        fontSize: 13,
        fontFamily: "Inter_600SemiBold",
        marginLeft: 6,
        color: "black",
    },
    footerText: {
        fontSize: 14,
        fontFamily: "Inter_100Thin",
        color: "#a1a1a1",
        marginTop: 20,
    },
    footerHighlight: {
        fontFamily: "Inter_600SemiBold",
        color: "white",
    },
});