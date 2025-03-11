import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, Dimensions, AppState, Text } from 'react-native';
import CozyCoveAnimated from  '../components/CozyCoveAnimated'
const SplashScreen = () => {

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
        <CozyCoveAnimated />
      </View>
    );
  };

  export default SplashScreen;

  