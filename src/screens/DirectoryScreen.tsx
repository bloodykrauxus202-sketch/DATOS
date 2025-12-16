import React, { useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import NavigationBar from "../components/NavigationBar";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  FadeInDown,
  FadeIn,
} from "react-native-reanimated";

type Props = NativeStackScreenProps<RootStackParamList, "Directory">;

// Exclude routes that require parameters
type SimpleRoute = Exclude<keyof RootStackParamList, "ParishDetail" | "SchoolDetail" | "CorporationDetail" | "CongregationDetail" | "BECDetail">;

interface DirectoryItem {
  id: string;
  title: string;
  image: any;
  route: SimpleRoute;
}

const directories: DirectoryItem[] = [
  {
    id: "1",
    title: "Parish",
    image: require("../../assets/Parish-1764828819730.jpeg"),
    route: "Parish",
  },
  {
    id: "2",
    title: "BEC",
    image: require("../../assets/BEC-1764828792772.jpeg"),
    route: "BEC",
  },
  {
    id: "3",
    title: "Clergy",
    image: require("../../assets/Priest-1764828826700.jpeg"),
    route: "Priest",
  },
  {
    id: "4",
    title: "Ministry",
    image: require("../../assets/Ministry-1764828817952.jpeg"),
    route: "Ministry",
  },
  {
    id: "5",
    title: "DCLAIM",
    image: require("../../assets/Lay Movement-1764828815995.jpeg"),
    route: "LayMovement",
  },
  {
    id: "6",
    title: "Vicariate",
    image: require("../../assets/Vicariate-1764828832821.jpeg"),
    route: "Vicariate",
  },
  {
    id: "7",
    title: "Schools",
    image: require("../../assets/Schools-1764828828863.jpeg"),
    route: "Schools",
  },
  {
    id: "8",
    title: "Congregation",
    image: require("../../assets/Congregation-1764828803303.jpeg"),
    route: "Congregation",
  },
  {
    id: "9",
    title: "Corporations",
    image: require("../../assets/Corporations-1764828805565.jpeg"),
    route: "Corporations",
  },
];

export default function DirectoryScreen({ navigation }: Props) {
  // Animation values for logo
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const logoRotate = useSharedValue(-10);
  const glowOpacity = useSharedValue(0);
  const glowScale = useSharedValue(1);

  // Animation values for text
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(15);
  const taglineOpacity = useSharedValue(0);

  // Decorative line animation
  const lineWidth = useSharedValue(0);

  useEffect(() => {
    // Logo entrance - scale up with slight rotation
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    logoScale.value = withDelay(200, withSequence(
      withTiming(1.15, { duration: 500, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) })
    ));
    logoRotate.value = withDelay(200, withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) }));

    // Glow effect behind logo
    glowOpacity.value = withDelay(400, withTiming(0.4, { duration: 500 }));
    glowScale.value = withDelay(600, withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    ));

    // "The Roman Catholic" - fade in and slide up
    titleOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(600, withTiming(0, { duration: 600, easing: Easing.out(Easing.back(1.5)) }));

    // "Diocese of Tagum" - fade in and slide up
    subtitleOpacity.value = withDelay(900, withTiming(1, { duration: 600 }));
    subtitleTranslateY.value = withDelay(900, withTiming(0, { duration: 600, easing: Easing.out(Easing.back(1.5)) }));

    // Decorative line expands
    lineWidth.value = withDelay(1200, withTiming(80, { duration: 500, easing: Easing.out(Easing.ease) }));

    // Tagline fades in
    taglineOpacity.value = withDelay(1400, withTiming(1, { duration: 500 }));
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` }
    ],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const lineAnimatedStyle = useAnimatedStyle(() => ({
    width: lineWidth.value,
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const handleDirectoryPress = (directory: DirectoryItem) => {
    navigation.navigate(directory.route);
  };

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={["#F8FAFC", "#EFF6FF", "#FFFFFF"]}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1" edges={["top"]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View className="px-6">
              {/* Animated Header with Logo */}
              <View className="items-center py-6 mb-6">
                {/* Logo with glow effect */}
                <View className="items-center justify-center mb-5">
                  {/* Glow behind logo */}
                  <Animated.View
                    style={[
                      {
                        position: "absolute",
                        width: 110,
                        height: 110,
                        borderRadius: 55,
                        backgroundColor: "#3B82F6",
                      },
                      glowAnimatedStyle,
                    ]}
                  />
                  {/* Animated Logo */}
                  <Animated.View
                    style={[
                      {
                        width: 96,
                        height: 96,
                        borderRadius: 48,
                        backgroundColor: "white",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.25,
                        shadowRadius: 12,
                        elevation: 8,
                        borderWidth: 3,
                        borderColor: "#DBEAFE",
                        overflow: "hidden",
                      },
                      logoAnimatedStyle,
                    ]}
                  >
                    <Image
                      source={require("../../assets/Diocese of Tagum-1764828361688.jpeg")}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  </Animated.View>
                </View>

                {/* "The Roman Catholic" - animated */}
                <Animated.Text
                  style={[
                    {
                      fontSize: 18,
                      fontWeight: "600",
                      color: "#374151",
                      textAlign: "center",
                      letterSpacing: 0.5,
                    },
                    titleAnimatedStyle,
                  ]}
                >
                  The Roman Catholic
                </Animated.Text>

                {/* "Diocese of Tagum" - animated with emphasis */}
                <Animated.Text
                  style={[
                    {
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#1E40AF",
                      textAlign: "center",
                      letterSpacing: 0.5,
                      marginTop: 2,
                    },
                    subtitleAnimatedStyle,
                  ]}
                >
                  Diocese of Tagum
                </Animated.Text>

                {/* Decorative gold line */}
                <Animated.View
                  style={[
                    {
                      height: 3,
                      backgroundColor: "#D4AF37",
                      borderRadius: 2,
                      marginTop: 12,
                      marginBottom: 8,
                    },
                    lineAnimatedStyle,
                  ]}
                />

                {/* Tagline */}
                <Animated.Text
                  style={[
                    {
                      fontSize: 13,
                      color: "#6B7280",
                      textAlign: "center",
                    },
                    taglineAnimatedStyle,
                  ]}
                >
                  Explore our directories
                </Animated.Text>
              </View>

              {/* Directory Grid - 3 columns with animated icons */}
              <View className="w-full">
                <View className="flex-row flex-wrap justify-between">
                  {directories.map((directory, index) => (
                    <Animated.View
                      key={directory.id}
                      entering={FadeInDown.delay(1500 + index * 80).duration(400).springify()}
                      style={{ width: "30%" }}
                    >
                      <Pressable
                        onPress={() => handleDirectoryPress(directory)}
                        className="items-center mb-6"
                      >
                        {({ pressed }) => (
                          <View
                            style={{
                              opacity: pressed ? 0.7 : 1,
                              transform: [{ scale: pressed ? 0.96 : 1 }],
                            }}
                          >
                            <View className="w-full aspect-square bg-white rounded-2xl items-center justify-center shadow-md mb-2 overflow-hidden border border-gray-100">
                              <Image
                                source={directory.image}
                                style={{ width: "100%", height: "100%" }}
                                contentFit="cover"
                              />
                            </View>
                            <Text className="text-xs font-semibold text-gray-800 text-center leading-tight">
                              {directory.title}
                            </Text>
                          </View>
                        )}
                      </Pressable>
                    </Animated.View>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Navigation Bar */}
          <NavigationBar canGoBack={false} />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
