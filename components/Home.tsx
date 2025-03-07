import React from 'react';
import { View, Text, StatusBar, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFonts, Inter_300Light, Inter_600SemiBold, Inter_700Bold, Inter_100Thin } from "@expo-google-fonts/inter";
import AppLoading from "expo-app-loading";

const Home = () => {

    let [fontsLoaded] = useFonts({
      Inter_300Light,
      Inter_600SemiBold,
      Inter_700Bold,
      Inter_100Thin,
    });
    if (!fontsLoaded) {
      return <AppLoading />;
    }
  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      {/* Profile Icon */}
      <View className="items-start px-5 pt-5 ">
        <Image
          source={{ uri: 'https://www.example.com/profile.png' }} // Replace with your profile image URL
          className="w-15 h-15 rounded-full"
        />
      </View>

      <View className="w-[96%] h-[35%] mt-5 rounded-[45] overflow-hidden">
        <LinearGradient
          colors={["#FFFFFF", "#4169E1", "#1E3A8A", "#121212", "#000000"]}
          locations={[0, 0.1, 0.2, 0.55, 1]}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{ flex: 1, padding: 20 }}
        >
    {/* Right - Action Buttons */}
    <View className="absolute top-5 right-5 flex-row space-x-2 p-2 px-3 ">
      {/* Add Task */}
      <View className="items-center">
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 50,
            padding: 6,
          }}
        >
          <Icon name="plus" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xs mt-1 px-10">Add</Text>
      </View>

      {/* Complete Task */}
      <View className="items-center">
        <TouchableOpacity
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 50,
            padding: 6,
          }}
        >
          <Icon name="check" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xs mt-1">Done</Text>
      </View>
    </View>

    {/* Left - Profile Icons & Tasks */}
    <View className="absolute mt-20  left-5 space-y-3">
      {/* Task 1 */}
      <View className="flex-row items-center space-x-2">
        <Icon name="account-circle" size={32} color="white" />
        <Text className="text-white text-xs ml-2">Aryan Sharma</Text>
      </View>
      <Text
        className="text-white text-[22px] ml-10 overflow-hidden"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        Finish the home page of the Application
      </Text>

      {/* Task 2 */}
      <View className="flex-row items-center space-x-2">
        <Icon name="account-circle" size={32} color="white" />
        <Text className="text-white text-xs ml-2">Keta Madhani</Text>
      </View>
      <Text
        className="text-white text-[22px] ml-10 overflow-hidden"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        Come back at night to see the progress of the application
      </Text>
    </View>
  </LinearGradient>
</View>



      {/* Two Side-by-Side Cards */}
      <View className="flex-row justify-between mt-5 px-5">
        <View className="bg-[#141417] h-[65%] w-[48%] justify-center rounded-tl-[30] rounded-br-[30]">
          <Text className="text-white text-center">Gallery</Text>
        </View>
        <View className="bg-[#141417] h-[65%] w-[48%] justify-center rounded-tl-[30] rounded-br-[30]">
          <Text className="text-white text-center">PostCard</Text>
        </View>
      </View>

      {/* Four Square Buttons */}
      <View className="flex-row justify-between px-5 ">
        <TouchableOpacity className="bg-[#141417] w-[48%] h-[45%] justify-center items-center rounded-lg">
          <Text className="text-white text-center">Button 1</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#141417] w-[48%] h-[45%] justify-center items-center rounded-lg">
          <Text className="text-white text-center">Button 2</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;
