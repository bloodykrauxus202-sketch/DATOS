import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

// Typewriter component for animated text
function TypewriterText({
  text,
  delay = 0,
  speed = 80,
  style,
  onComplete,
}: {
  text: string;
  delay?: number;
  speed?: number;
  style?: object;
  onComplete?: () => void;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [startTyping, setStartTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setStartTyping(true);
    }, delay);
    return () => clearTimeout(delayTimer);
  }, [delay]);

  useEffect(() => {
    if (!startTyping) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        // Hide cursor and call onComplete after typing finishes
        setTimeout(() => {
          setShowCursor(false);
          onComplete?.();
        }, 300);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [startTyping, text, speed, onComplete]);

  return (
    <Text style={style}>
      {displayedText}
      {showCursor && startTyping && (
        <Text style={{ color: "#B45309" }}>|</Text>
      )}
    </Text>
  );
}

const surroundingIcons = [
  { id: "1", image: require("../../assets/Parish-1764828819730.jpeg") },
  { id: "2", image: require("../../assets/BEC-1764828792772.jpeg") },
  { id: "3", image: require("../../assets/Priest-1764828826700.jpeg") },
  { id: "4", image: require("../../assets/Ministry-1764828817952.jpeg") },
  { id: "5", image: require("../../assets/Lay Movement-1764828815995.jpeg") },
  { id: "6", image: require("../../assets/Vicariate-1764828832821.jpeg") },
  { id: "7", image: require("../../assets/Schools-1764828828863.jpeg") },
  { id: "8", image: require("../../assets/Congregation-1764828803303.jpeg") },
  { id: "9", image: require("../../assets/Corporations-1764828805565.jpeg") },
  { id: "10", image: require("../../assets/History-1764828807646.jpeg") },
];

// Animated Icon Component
function AnimatedIcon({
  icon,
  index,
  total,
  radius,
  iconSize
}: {
  icon: typeof surroundingIcons[0];
  index: number;
  total: number;
  radius: number;
  iconSize: number;
}) {
  // Animation values
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Each icon highlights in sequence with a dramatic effect
    // Total cycle time: 10 seconds (1 second per icon)
    const cycleDuration = 10000;
    const highlightDuration = 1000;
    const delayPerIcon = cycleDuration / total;
    const iconDelay = index * delayPerIcon;

    // Create a sequential highlight effect
    setTimeout(() => {
      // Scale animation - dramatic pop effect for each icon in sequence
      scale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: iconDelay }),
          withTiming(1.4, {
            duration: 300,
            easing: Easing.out(Easing.back(1.5))
          }),
          withTiming(1, {
            duration: 400,
            easing: Easing.inOut(Easing.ease)
          }),
          withTiming(1, { duration: cycleDuration - iconDelay - 700 })
        ),
        -1,
        false
      );

      // Floating animation - more prominent
      translateY.value = withRepeat(
        withSequence(
          withTiming(0, { duration: iconDelay }),
          withTiming(-15, {
            duration: 350,
            easing: Easing.out(Easing.quad)
          }),
          withTiming(0, {
            duration: 350,
            easing: Easing.in(Easing.quad)
          }),
          withTiming(0, { duration: cycleDuration - iconDelay - 700 })
        ),
        -1,
        false
      );

      // Opacity pulse - very noticeable spotlight effect
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: iconDelay }),
          withTiming(1, {
            duration: 200,
            easing: Easing.out(Easing.ease)
          }),
          withTiming(1, {
            duration: 500
          }),
          withTiming(0.4, {
            duration: 300,
            easing: Easing.in(Easing.ease)
          }),
          withTiming(0.4, { duration: cycleDuration - iconDelay - 1000 })
        ),
        -1,
        false
      );
    }, 50);
  }, [index, total]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
      opacity: opacity.value,
    };
  });

  const getIconPosition = (idx: number, tot: number, rad: number) => {
    const angle = (idx * 2 * Math.PI) / tot - Math.PI / 2;
    return {
      left: Math.cos(angle) * rad,
      top: Math.sin(angle) * rad,
    };
  };

  const position = getIconPosition(index, total, radius);

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: iconSize,
          height: iconSize,
          left: 175 + position.left - iconSize / 2,
          top: 175 + position.top - iconSize / 2,
        },
        animatedStyle,
      ]}
    >
      <View className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 w-full h-full">
        <Image
          source={icon.image}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </View>
    </Animated.View>
  );
}

export default function WelcomeScreen({ navigation }: Props) {
  // State for showing diocese name after typewriter finishes
  const [showDioceseName, setShowDioceseName] = useState(false);

  // Diocese name animation values
  const dioceseOpacity = useSharedValue(0);
  const dioceseTranslateY = useSharedValue(30);

  // Center logo animations
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoY = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);
  const shimmerTranslate = useSharedValue(-200);
  const pulseScale = useSharedValue(1);

  // Called when typewriter finishes
  const handleTypewriterComplete = () => {
    setShowDioceseName(true);
    dioceseOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
    dioceseTranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.back(1.5)) });
  };

  const dioceseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: dioceseOpacity.value,
    transform: [{ translateY: dioceseTranslateY.value }],
  }));

  useEffect(() => {
    // Initial entrance animation - dramatic drop in with bounce
    logoOpacity.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) })
    );

    logoY.value = withSequence(
      withTiming(-100, { duration: 0 }),
      withTiming(0, { duration: 800, easing: Easing.out(Easing.bounce) })
    );

    logoScale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1.3, { duration: 600, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) })
    );

    // Breathing effect - gentle scale pulsing
    setTimeout(() => {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.08, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }, 1000);

    // Pulsing glow effect with opacity change
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.2, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Shimmer light effect
    setTimeout(() => {
      shimmerTranslate.value = withRepeat(
        withSequence(
          withTiming(-200, { duration: 0 }),
          withTiming(200, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
          withTiming(200, { duration: 1500 })
        ),
        -1,
        false
      );
    }, 1200);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: logoY.value },
        { scale: logoScale.value * pulseScale.value }
      ],
      opacity: logoOpacity.value,
    };
  });

  const glowAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: glowScale.value }],
      opacity: glowOpacity.value,
    };
  });

  const shimmerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shimmerTranslate.value }],
    };
  });

  const handleContinue = () => {
    navigation.navigate("Directory");
  };

  const radius = 140; // Distance from center
  const iconSize = 65;

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={["#F8FAFC", "#EFF6FF", "#FFFFFF"]}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
          <View className="flex-1 items-center justify-center px-6">
            {/* Welcome Text with Typewriter Animation */}
            <View className="mb-16 items-center">
              {/* "Welcome to the" - Signature style with typewriter effect */}
              <View className="mb-2">
                <TypewriterText
                  text="Welcome to the"
                  delay={500}
                  speed={100}
                  onComplete={handleTypewriterComplete}
                  style={{
                    fontSize: 26,
                    fontStyle: "italic",
                    fontWeight: "300",
                    color: "#92400E",
                    letterSpacing: 1.5,
                    textAlign: "center",
                  }}
                />
              </View>

              {/* "The Roman Catholic Diocese of Tagum" - Fades in after typewriter */}
              <Animated.View style={dioceseAnimatedStyle} className="items-center">
                <Text
                  className="text-center font-bold text-gray-800"
                  style={{ fontSize: 24, lineHeight: 30 }}
                >
                  The Roman Catholic
                </Text>
                <Text
                  className="text-center font-bold"
                  style={{ fontSize: 28, lineHeight: 34, color: "#1E40AF" }}
                >
                  Diocese of Tagum
                </Text>
              </Animated.View>

              {/* Tagline - appears after diocese name */}
              {showDioceseName && (
                <Animated.Text
                  entering={FadeInDown.delay(400).duration(600)}
                  className="text-sm text-center text-gray-600 leading-6 px-4 mt-4"
                >
                  Your all-in-one directory for everything within the Diocese
                </Animated.Text>
              )}
            </View>

            {/* Center Logo with Surrounding Icons */}
            <View className="items-center justify-center mb-20" style={{ height: 350, width: 350 }}>
              {/* Surrounding Icons in Circle */}
              <View className="absolute" style={{ width: 350, height: 350 }}>
                {surroundingIcons.map((icon, index) => (
                  <AnimatedIcon
                    key={icon.id}
                    icon={icon}
                    index={index}
                    total={surroundingIcons.length}
                    radius={radius}
                    iconSize={iconSize}
                  />
                ))}
              </View>

              {/* Center Diocese Logo */}
              <View className="items-center justify-center z-10">
                {/* Animated Glow Ring Behind Logo */}
                <Animated.View
                  style={[
                    {
                      position: "absolute",
                      width: 160,
                      height: 160,
                      borderRadius: 80,
                      backgroundColor: "#3B82F6",
                    },
                    glowAnimatedStyle,
                  ]}
                />

                {/* Animated Logo */}
                <Animated.View
                  style={[
                    {
                      width: 144,
                      height: 144,
                      borderRadius: 72,
                      backgroundColor: "white",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 10 },
                      shadowOpacity: 0.3,
                      shadowRadius: 20,
                      elevation: 10,
                      borderWidth: 4,
                      borderColor: "#DBEAFE",
                      overflow: "hidden",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                    logoAnimatedStyle,
                  ]}
                >
                  <Image
                    source={require("../../assets/Diocese of Tagum-1764828361688.jpeg")}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />

                  {/* Shimmer light effect overlay */}
                  <Animated.View
                    style={[
                      {
                        position: "absolute",
                        width: 50,
                        height: "200%",
                        backgroundColor: "rgba(255, 255, 255, 0.4)",
                        transform: [{ rotate: "25deg" }],
                      },
                      shimmerAnimatedStyle,
                    ]}
                  />
                </Animated.View>
              </View>
            </View>

            {/* Continue Button */}
            <Pressable
              onPress={handleContinue}
              className="bg-blue-600 px-12 py-4 rounded-full shadow-lg"
            >
              {({ pressed }) => (
                <Text
                  className="text-white text-lg font-semibold"
                  style={{ opacity: pressed ? 0.8 : 1 }}
                >
                  Continue
                </Text>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
