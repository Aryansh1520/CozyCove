import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, Dimensions, AppState, Text, SafeAreaView , StatusBar } from 'react-native';
import CozyCoveAnimated from  '../components/CozyCoveAnimated'
const SplashScreen = () => {

    return (
      <SafeAreaView className='flex-1 bg-black'>
      <StatusBar backgroundColor="#000"  />

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
        <CozyCoveAnimated />
      </View>
      </SafeAreaView>
    );
  };

  export default SplashScreen;

  