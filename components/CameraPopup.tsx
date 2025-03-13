import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, PanResponder } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import AsyncStorage from "@react-native-async-storage/async-storage"; 

const POPUP_WIDTH = 368;
const POPUP_HEIGHT = 316;
const COLOR_SPECTRUM = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3', '#FF1493', '#FFFFFF', '#000000'];
import ViewShot from 'react-native-view-shot';
const CameraPopup = ({ onClose }) => {
  const [userName, setUserName] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<CameraType>("back");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [sliderPosition, setSliderPosition] = useState(0);
  const cameraRef = useRef(null);
  const sliderWidth = POPUP_WIDTH - 40;
  const middleSliderWidth = 180; // Width of slider in the middle section
  const colorUpdateTimeoutRef = useRef(null);
  const sliderRef = useRef(null);
  const viewShotRef = useRef(null);
  
  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    const fetchDetails = async () => {
        const storedUserName = await AsyncStorage.getItem("userName");
        console.log("Here" , storedUserName)

        setUserName(storedUserName);

    };
    fetchDetails();
}, []);

  const getColorFromPosition = (position: number) => {
    const normalizedPosition = Math.max(0, Math.min(position, sliderWidth));
    const segmentWidth = sliderWidth / (COLOR_SPECTRUM.length - 1);
    const startIndex = Math.floor(normalizedPosition / segmentWidth);
    const endIndex = Math.min(startIndex + 1, COLOR_SPECTRUM.length - 1);
    
    const startColor = COLOR_SPECTRUM[startIndex];
    const endColor = COLOR_SPECTRUM[endIndex];
    
    const segmentPosition = (normalizedPosition % segmentWidth) / segmentWidth;

    const interpolate = (start, end) => Math.round(start + (end - start) * segmentPosition);

    const colorToRGB = (hex) => ({
      r: parseInt(hex.substring(1, 3), 16),
      g: parseInt(hex.substring(3, 5), 16),
      b: parseInt(hex.substring(5, 7), 16),
    });

    const startRGB = colorToRGB(startColor);
    const endRGB = colorToRGB(endColor);

    return `#${interpolate(startRGB.r, endRGB.r).toString(16).padStart(2, '0')}${interpolate(startRGB.g, endRGB.g).toString(16).padStart(2, '0')}${interpolate(startRGB.b, endRGB.b).toString(16).padStart(2, '0')}`;
  };


// Debounced color update function to prevent excessive re-renders
const updateSliderPosition = useCallback((position) => {
    const clampedPosition = Math.max(0, Math.min(position, sliderWidth));
    setSliderPosition(clampedPosition);
    setTextColor(getColorFromPosition(clampedPosition));
  }, []);
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      // Adjust the gesture move value as needed to match your slider's layout
      updateSliderPosition(gestureState.moveX - 20);
    },
    onPanResponderRelease: () => {
      setTextColor(getColorFromPosition(sliderPosition));
    },
  });
  
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo.uri);
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };



  const useSendImage = () => {
    const sendImage = async (imageUri, username) => {
      const url = "https://physically-relaxing-baboon.ngrok-free.app/uploadSnap";
  
      try {
        const formData = new FormData();
        formData.append("image", {
          uri: imageUri,
          type: "image/jpeg", // Adjust based on actual file type
          name: `upload${Date.now()}.jpg`, // Unique filename
        });
        console.log(username)
        formData.append("username", username); // Attach username
  
        const response = await fetch(url, {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        const result = await response.json();
        return result;
      } catch (error) {
        console.error("Error sending image:", error);
        return { success: false, error };
      }
    };
  
    return { sendImage };
  };
  


  const handleSendImage = async () => {
    if (viewShotRef.current) {
      try {
        // Capture the view including image and text
        const uri = await viewShotRef.current.capture();
        console.log("Captured Image URI:", uri);
  
        // Send the captured image to your endpoint
        const { sendImage } = useSendImage();
        const response = await sendImage(uri , userName);
        console.log(response);
  
      } catch (error) {
        console.error("Error capturing image:", error);
      }
    }
  };

  const flipCamera = () => setType(type === "back" ? "front" : "back");

  // Clean up the timeout on unmount
  useEffect(() => {
    return () => {
      if (colorUpdateTimeoutRef.current !== null) {
        clearTimeout(colorUpdateTimeoutRef.current);
      }
    };
  }, []);

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <Modal transparent animationType="slide" visible={true} onRequestClose={onClose}>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-70">
          <View className="bg-gray-800 rounded-3xl p-4 items-center">
            <Text className="text-white text-lg">No access to camera</Text>
            <TouchableOpacity className="mt-4 bg-blue-500 px-4 py-2 rounded-full" onPress={requestPermission}>
              <Text className="text-white">Request Permission</Text>
            </TouchableOpacity>
            <TouchableOpacity className="mt-2 bg-gray-600 px-4 py-2 rounded-full" onPress={onClose}>
              <Text className="text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal transparent animationType="slide" visible={true} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black bg-opacity-70">
        <View className="bg-gray-800 rounded-[45] p-4">
          <View className="rounded-[46] overflow-hidden" style={{ width: POPUP_WIDTH, height: POPUP_HEIGHT }}>
            {capturedImage ? (
            <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
              <View className="relative w-full h-full">
                <Image source={{ uri: capturedImage }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                {inputText && (
                  <View className="absolute bottom-4 left-0 right-0 items-center">
                    <Text style={{ color: textColor, fontSize: 18, fontWeight: 'bold', textAlign: 'center', padding: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 8 }}>
                      {inputText}
                    </Text>
                  </View>
                )}
              </View>
              </ViewShot>
            ) : (
              <CameraView ref={cameraRef} type={type} style={{ width: '100%', height: '100%' }} />
            )}
          </View>

          <View className="flex-row justify-between items-center mt-4">
            {!capturedImage ? (
              <>
                <TouchableOpacity className="bg-gray-700 p-3 rounded-full" onPress={flipCamera}>
                  <MaterialIcons name="flip-camera-ios" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-red-500 p-3 rounded-full" onPress={takePicture}>
                  <MaterialIcons name="camera" size={24} color="white" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity className="bg-gray-700 p-3 rounded-full" onPress={() => setCapturedImage(null)}>
                  <MaterialIcons name="refresh" size={24} color="white" />
                </TouchableOpacity>
                
                {/* Improved slider with better hitbox */}
{/* Improved slider with better hitbox */}
<View className="flex-row items-center " style={{ width: middleSliderWidth }}>
  <View
    className="w-6 h-6 rounded-full border-2 border-white mr-2"
    style={{ backgroundColor: textColor }}
  />
  <View className="h-8 flex-1 relative">
    {/* Slider track */}
    <View className="absolute top-1/2 left-0 right-0 h-4 rounded-full bg-gray-700 -translate-y-1/2">
      <View className="absolute top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-40 rounded-full" />
    </View>

    {/* Touchable area with increased hitbox */}
    <View
      className="absolute"
      style={{ top: -10, left: -10, right: -0, bottom: -10 }}
      {...panResponder.panHandlers}
    />

    {/* Slider thumb */}
    <View
      className="absolute top-1/2 w-6 h-6 rounded-full border-2 border-white -translate-y-1/2"
      style={{
        // Calculate the thumb center position and clamp between 0 and (middleSliderWidth - thumb width)
        left: Math.min(
          Math.max((sliderPosition / sliderWidth) * middleSliderWidth - 12, 0),
          middleSliderWidth - 40
        ),
        backgroundColor: textColor,
      }}
    />
  </View>
</View>

              </>
            )}
            <TouchableOpacity className="bg-gray-700 p-3 rounded-full" onPress={onClose}>
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {capturedImage && (
            <View className="mt-4">
              {/* Your TextInput and Send button */}
              <View className="flex-row items-center bg-gray-700 rounded-full px-4 py-2">
                <TextInput
                  className="flex-1 text-white"
                  placeholder="Add text to image..."
                  placeholderTextColor="#AAA"
                  value={inputText}
                  onChangeText={setInputText}
                />
                <TouchableOpacity 
                  className="ml-2 bg-blue-500 p-2 rounded-full"
                  onPress={handleSendImage} // Updated function call
>
                  <MaterialIcons name="send" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CameraPopup;