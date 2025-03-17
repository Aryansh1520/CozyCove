import React, { useState, useEffect } from 'react';
import { View, Dimensions, TouchableOpacity, ActivityIndicator ,Text ,Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import CameraPopup from './CameraPopup';
import useFetchUserImage from 'hooks/useHome';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useReactionHandler from 'utils/handleReactionPress';
import DaysLeft from "./DaysLeft"
const { height } = Dimensions.get('screen');
const { width } = Dimensions.get("window");
const Home = () => {
  const insets = useSafeAreaInsets();
  const [pushToken, setPushToken] = useState(null);
  const [showCameraPopup, setShowCameraPopup] = useState(false);
  const { imageUri, loading, error } = useFetchUserImage();
  const handleReactionPress = useReactionHandler();
  useEffect(() => {
    const fetchDetails = async () => {
      const storedPushToken = await AsyncStorage.getItem("expoPushToken");
      setPushToken(storedPushToken);
    };
    fetchDetails();
  }, []);

  return (
    <View className="flex-1 bg-black items-center" style={{ paddingTop: insets.top, height }}>
      <View
        style={{
          width: "96%",
          height: height * 0.38,
          marginTop: "5%",
          borderRadius: 45,
          overflow: "hidden",
          position: "relative"
        }}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : error ? (
          <Image
            source={{ uri: "https://i.ibb.co/MDH9scKP/5221808.jpg" }}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <Image
            source={{ uri: imageUri }}
            style={{ width: "100%", height: "100%" }}
            transition={300}
          />
        )}

        <TouchableOpacity
          className="absolute bottom-4 right-4 bg-black bg-opacity-50 p-3 rounded-full"
          onPress={() => setShowCameraPopup(true)}
        >
          <MaterialIcons name="camera-alt" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Reaction Buttons */}
      <View className="flex-row justify-between mt-5 w-11/12">
        <TouchableOpacity
          className="flex-1 bg-[#141417] m-1 p-4 items-center rounded-xl"
          onPress={() => handleReactionPress("heart")}
        >
          <FontAwesome5 name="heart" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-[#141417] m-1 p-4 items-center rounded-xl"
          onPress={() => handleReactionPress("hug")}
        >
          <FontAwesome5 name="hands" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-[#141417] m-1 p-4 items-center rounded-xl"
          onPress={() => handleReactionPress("kiss")}
        >
          <FontAwesome5 name="kiss-wink-heart" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-[#141417] m-1 p-4 items-center rounded-xl"
          onPress={() => handleReactionPress("fire")}
        >
          <FontAwesome5 name="fire" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-between w-full px-4">
  {/* Keta's Mood */}
  <View
    className="bg-[#141417] rounded-3xl flex flex-col justify-between"
    style={{ width: width * 0.45, height: height * 0.2, marginTop: height * 0.02 }}
  >
    <Text className="text-5xl text-center mt-4 pt-10">😊</Text>
    <Text className="text-white text-lg text-center mb-5">Keta's Mood</Text>
  </View>

  {/* Aryan's Mood */}
  <View
    className="bg-[#141417] rounded-3xl flex flex-col justify-between"
    style={{ width: width * 0.45, height: height * 0.2, marginTop: height * 0.02 }}
  >
    <Text className="text-5xl text-center mt-4 pt-10">😎</Text>
    <Text className="text-white text-lg text-center mb-5">Aryan's Mood</Text>
  </View>
</View>
      <DaysLeft />
      {showCameraPopup && <CameraPopup onClose={() => setShowCameraPopup(false)} />}

    </View>
  );
};

export default Home;
