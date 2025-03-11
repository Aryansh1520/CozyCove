import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Text as SvgText, Defs, Filter, FeGaussianBlur, FeMerge, FeMergeNode, FeColorMatrix } from 'react-native-svg';
import * as Font from 'expo-font';
import Animated, { useSharedValue, useAnimatedProps, withTiming, withSequence, withRepeat, Easing } from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(SvgText);
const { width } = Dimensions.get('window');
const text = 'CozyCove';

const HandwrittenText = () => {
  const [isFontReady, setIsFontReady] = useState(false);
  const strokeOffset = useSharedValue(300);
  const textColor = useSharedValue('white');

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'PlaywriteHU': require('../assets/PlaywriteHU-VariableFont_wght.ttf'),
      });
      setIsFontReady(true);
    }
    loadFont();
  }, []);

  useEffect(() => {
    if (isFontReady) {
      strokeOffset.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(300, { duration: 3000, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // Infinite loop
        false // No reversing as we handle it manually in sequence
      );

      textColor.value = withRepeat(
        withSequence(
          withTiming('#fc3400', { duration: 3000 }),
          withTiming('white', { duration: 3000 })
        ),
        -1
      );
    }
  }, [isFontReady]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeOffset.value,
    stroke: textColor.value,
  }));

  if (!isFontReady) return null;

  return (
    <View style={styles.container}>
      <Svg height="100" width={width} viewBox={`0 0 ${width} 100`}>
        <Defs>
          <Filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <FeGaussianBlur stdDeviation="4" result="blur" />
            <FeColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
            <FeMerge>
              <FeMergeNode in="blur" />
              <FeMergeNode in="SourceGraphic" />
            </FeMerge>
          </Filter>
        </Defs>
        <AnimatedText
          x="50%"
          y="50%"
          textAnchor="middle"
          fontSize="48"
          fontFamily="PlaywriteHU"
          fill="none"
          strokeWidth="2"
          strokeDasharray={300}
          animatedProps={animatedProps}
        >
          {text}
        </AnimatedText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});

export default HandwrittenText;
