import React from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Easing } from 'react-native';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ExitPopup = ({ visible, onClose, onExit }) => {
  // Animation for popup entrance
  const [animation] = React.useState(new Animated.Value(0));
  
  React.useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      animation.setValue(0);
    }
  }, [visible]);

  // Derived animations
  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });
  
  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Modal transparent visible={visible} animationType="fade">
      <BlurView intensity={40} tint="dark" style={{ flex: 1 }}>
        <View className="flex-1 justify-center items-center">
          <Animated.View 
            style={{ 
              transform: [{ scale }],
              opacity 
            }}
            className="bg-[#1C1C24] p-6 rounded-2xl w-80 shadow-lg"
          >
            <View className="items-center mb-4">
              <Icon name="exit-run" size={40} color="#F43F5E" />
            </View>
            
            <Text className="text-white text-center text-xl font-bold mb-2">
              Exit Application
            </Text>
            
            <Text className="text-gray-400 text-center mb-6">
              Are you sure you want to leave the app?
            </Text>
            
            <View className="flex-row justify-between space-x-3">
              <TouchableOpacity 
                onPress={onClose}
                className="flex-1 bg-[#2A2A36] py-3 rounded-xl items-center border border-gray-700"
                activeOpacity={0.7}
              >
                <Text className="text-white font-medium">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={onExit}
                className="flex-1 bg-gradient-to-r from-[#F43F5E] to-[#E11D48] py-3 rounded-xl items-center"
                activeOpacity={0.7}
              >
                <Text className="text-white font-medium">Exit</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default ExitPopup;