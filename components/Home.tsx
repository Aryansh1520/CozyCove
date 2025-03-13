import React, { useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import CameraPopup from './CameraPopup';
import useFetchUserImage from 'hooks/useHome';
const { height } = Dimensions.get('screen');

const Home = () => {
  const insets = useSafeAreaInsets();
  const [showCameraPopup, setShowCameraPopup] = useState(false);
  const { imageUri, loading, error } = useFetchUserImage();

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
          <Text style={{ color: 'red', textAlign: 'center' }}>Error: {error}</Text>
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
      
      <Text style={{ color: 'white', fontSize: 18 }}>Home</Text>
      
      {/* CameraPopup is mounted ONLY when it's needed */}
      {showCameraPopup && <CameraPopup onClose={() => setShowCameraPopup(false)} />}
    </View>
  );
};

export default Home;
