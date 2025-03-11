import React, { useEffect, useState, useCallback, useRef } from "react";
import { 
  View, 
  FlatList, 
  ActivityIndicator, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  Animated, 
  Easing, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Dimensions
} from "react-native";
import { Image } from "expo-image";
import { useImageStore } from "../store/useImageStore"; // Adjust path if needed
import { useFonts, Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface ImageItem {
  filename: string;
  url?: string;
  comments?: string[];
  id?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ImageFeed: React.FC = () => {
  const { images, loading, fetchImages } = useImageStore();
  const [fontLoaded] = useFonts({ Pacifico: Pacifico_400Regular });
  const [isFontReady, setIsFontReady] = useState(false);
  // State for each image like status
  const [likedImages, setLikedImages] = useState<Record<string, boolean>>({});
  
  // Animation values
  const [gradientAnimation] = useState(new Animated.Value(0));
  const heartAnimations = useRef<Record<string, Animated.Value>>({}).current;
  
  // Reference for storing last tap time for each image
  const lastTapTime = useRef<Record<string, number>>({}).current;
  
  // State for zoom/focus effect
  const [focusedImage, setFocusedImage] = useState<string | null>(null);
  const zoomAnimation = useRef(new Animated.Value(1)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (fontLoaded) {
      setIsFontReady(true);
    }
  }, [fontLoaded]);

  useEffect(() => {
    if (images.length === 0) {
      fetchImages();
    }
  }, [images.length, fetchImages]);

  // Initialize animation objects for new images
  useEffect(() => {
    images.forEach(img => {
      const id = img.id || img.filename;
      if (!heartAnimations[id]) {
        heartAnimations[id] = new Animated.Value(0);
      }
    });
  }, [images, heartAnimations]);

  // Setup gradient animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(gradientAnimation, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(gradientAnimation, {
          toValue: 0,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [gradientAnimation]);

  const toggleLike = useCallback((imageId: string) => {
    setLikedImages(prev => ({
      ...prev,
      [imageId]: !prev[imageId]
    }));

    // Animate heart
    if (!heartAnimations[imageId]) {
      heartAnimations[imageId] = new Animated.Value(0);
    }

    // Only show animation when liking (not when unliking)
    const isLiked = likedImages[imageId];
    if (!isLiked) {
      Animated.sequence([
        Animated.timing(heartAnimations[imageId], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(heartAnimations[imageId], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [heartAnimations, likedImages]);

  const handleDoubleTap = useCallback((imageId: string) => {
    const now = Date.now();
    const lastTap = lastTapTime[imageId] || 0;
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // It's a double tap - toggle like status
      toggleLike(imageId);
    }

    lastTapTime[imageId] = now;
  }, [toggleLike, lastTapTime]);

  const handleLongPress = useCallback((imageId: string) => {
    setFocusedImage(imageId);
    
    // Zoom in and show translucent background
    Animated.parallel([
      Animated.spring(zoomAnimation, {
        toValue: 1.2,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [zoomAnimation, backgroundOpacity]);

  const handleZoomOut = useCallback(() => {
    // Zoom out and hide background
    Animated.parallel([
      Animated.spring(zoomAnimation, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setFocusedImage(null);
    });
  }, [zoomAnimation, backgroundOpacity]);

  const renderItem = useCallback(({ item, index }: { item: ImageItem; index: number }) => {
    const imageId = item.id || item.filename;
    const isLiked = likedImages[imageId] || false;
    const isFocused = focusedImage === imageId;

    return (
      <View
        style={{
          marginBottom: 24,
          backgroundColor: "#141417",
          borderRadius: 12,
          padding: 12,
          shadowOpacity: 0.1,
          width: "100%",
          position: "relative",
          // Added texture
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 6,
          elevation: 3,
          borderWidth: 1,
          borderColor: "#2a2a2d",
        }}
      >
        <TouchableWithoutFeedback 
          onPress={() => handleDoubleTap(imageId)}
          onLongPress={() => handleLongPress(imageId)}
          delayLongPress={300}
        >
          <View style={{ position: 'relative' }}>
            {/* Background texture */}
            <View style={{
              position: 'absolute',
              width: '100%',
              height: 300,
              borderRadius: 15,
              backgroundColor: '#0a0a0c',
              opacity: 0.2,
              zIndex: 1
            }} />
            
            <Image
              source={{ uri: item.url || "https://via.placeholder.com/400" }}
              style={{ 
                width: "100%", 
                height: 300, 
                borderRadius: 15, 
                zIndex: 2 
              }}
              cachePolicy="disk"
              onError={(e) => console.log("Image Load Error:", e)}
            />

            {/* Noise texture overlay */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 15,
              opacity: 0.05,
              backgroundColor: '#000',
              zIndex: 3
            }} />

            {/* Heart animation overlay */}
            <Animated.View
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: [
                  { translateX: -25 }, 
                  { translateY: -25 },
                  { scale: heartAnimations[imageId] || new Animated.Value(0) }
                ],
                opacity: heartAnimations[imageId] || new Animated.Value(0),
                zIndex: 10,
              }}
            >
              <Icon name="heart" size={50} color="red" />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>

        <View style={{ 
          flexDirection: "row", 
          justifyContent: "space-between", 
          marginTop: 10,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.08)',
        }}>
          <TouchableOpacity 
            onPress={() => toggleLike(imageId)}
            style={{
              padding: 6,
              backgroundColor: isLiked ? 'rgba(255,0,0,0.1)' : 'transparent',
              borderRadius: 50,
            }}
          >
            <Icon
              name="heart"
              size={30}
              color={isLiked ? "red" : "#fff"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              padding: 6,
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: 50,
            }}
          >
            <Icon
              name="comment-outline"
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {item.comments?.length > 0 && (
          <View style={{ 
            marginTop: 12,
            padding: 10,
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 8,
            borderLeftWidth: 3,
            borderLeftColor: '#3b82f6'
          }}>
            <Text style={{ fontWeight: 'bold', color: "#fff", marginBottom: 5 }}>Comments:</Text>
            {item.comments.map((comment, index) => (
              <Text key={index} style={{ 
                fontSize: 14, 
                color: "#a0a0a0",
                marginVertical: 3,
                paddingLeft: 8
              }}>
                • {comment}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  }, [likedImages, focusedImage, handleDoubleTap, handleLongPress, toggleLike, heartAnimations]);

  // Interpolating colors for gradient animation
  const animatedGradientColor = gradientAnimation.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [
      "#ff7e5f", // Red shade
      "#d060ff", // Techy purple
      "#4f8cff", // Blue
      "#00d9ff", // Cyan
      "#ff4b81", // Pink
      "#feb47b", // Yellow-orange
    ],
  });

  if (!isFontReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <View style={{ flex: 1, backgroundColor: "#000", paddingHorizontal: 16, marginTop: 8, marginBottom: 40 }}>
        <View
          style={{
            alignItems: "flex-start",
            paddingVertical: 12,
            marginTop: 20,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            overflow: "hidden",
          }}
        >
          <Animated.Text
            style={{
              fontFamily: "Pacifico",
              fontSize: 28,
              color: animatedGradientColor,
              marginBottom: 5,
              textShadowColor: 'rgba(0, 0, 0, 0.75)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3,
            }}
          >
            InstaKeta
          </Animated.Text>
        </View>

        <View style={{ borderBottomWidth: 1, borderBottomColor: "#333", marginTop: 5 , marginBottom: 10 }} >
          <FlatList
            data={images}
            keyExtractor={(item) => item.id || item.filename}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 90 }}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}
          />
        </View>
      </View>

      {/* Zoom/focus overlay */}
      {focusedImage && (
        <TouchableWithoutFeedback onPress={handleZoomOut}>
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: backgroundOpacity,
            }}
          >
            <Animated.View
              style={{
                transform: [{ scale: zoomAnimation }],
                width: SCREEN_WIDTH * 0.9,
                height: 350,
                borderRadius: 15,
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
                // Added texture
                shadowColor: "#fff",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
              }}
            >
              <Image
                source={{ uri: images.find(img => (img.id || img.filename) === focusedImage)?.url }}
                style={{
                  width: '85%',
                  height: '80%',
                  borderRadius: 15,
                  alignSelf: 'center',
                }}
                cachePolicy="disk"
              />
              
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
};

export default ImageFeed;