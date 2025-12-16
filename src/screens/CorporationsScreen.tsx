import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { fetchAllCorporationDetails, CorporationDetails } from "../api/googleSheets";
import NavigationBar from "../components/NavigationBar";

type Props = NativeStackScreenProps<RootStackParamList, "Corporations">;

export default function CorporationsScreen({ navigation }: Props) {
  const [corporations, setCorporations] = useState<CorporationDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCorporations();
  }, []);

  const loadCorporations = async () => {
    try {
      setLoading(true);
      setError(null);
      const corporationData = await fetchAllCorporationDetails();
      setCorporations(corporationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load corporations");
      console.error("Error loading corporations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCorporationPress = (corporation: CorporationDetails) => {
    navigation.navigate("CorporationDetail", { corporation });
  };

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={["#F8FAFC", "#EFF6FF", "#FFFFFF"]}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1" edges={["top"]}>
          {/* Header */}
          <View className="px-6 pt-4 pb-6 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="w-20 h-20 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mr-4">
                <Image
                  source={require("../../assets/Corporations-1764828805565.jpeg")}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-1">
                  Corporations
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  Church corporations and affiliated entities
                </Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View className="px-6 py-6">
              {loading && (
                <View className="items-center justify-center py-20">
                  <ActivityIndicator size="large" color="#3B82F6" />
                  <Text className="text-gray-600 mt-4">Loading corporations...</Text>
                </View>
              )}

              {error && (
                <View className="bg-red-50 rounded-3xl p-6 border border-red-200">
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="alert-circle" size={24} color="#EF4444" />
                    <Text className="text-lg font-bold text-red-900 ml-2">
                      Error
                    </Text>
                  </View>
                  <Text className="text-red-800 mb-4 leading-6">{error}</Text>
                  <Pressable
                    onPress={loadCorporations}
                    className="bg-red-600 py-3 px-6 rounded-xl"
                  >
                    {({ pressed }) => (
                      <Text
                        className="text-white font-semibold text-center"
                        style={{ opacity: pressed ? 0.8 : 1 }}
                      >
                        Try Again
                      </Text>
                    )}
                  </Pressable>
                  <Text className="text-xs text-gray-500 mt-4 text-center">
                    Loading corporations from Google Sheets. Check your internet connection.
                  </Text>
                </View>
              )}

              {!loading && !error && corporations.length === 0 && (
                <View className="bg-gray-50 rounded-3xl p-6 items-center">
                  <Ionicons name="search" size={48} color="#9CA3AF" />
                  <Text className="text-gray-600 text-center mt-4">
                    No corporations found
                  </Text>
                </View>
              )}

              {!loading && !error && corporations.length > 0 && (
                <View>
                  <Text className="text-lg font-bold text-gray-900 mb-4">
                    {corporations.length} {corporations.length === 1 ? "Corporation" : "Corporations"}
                  </Text>
                  {corporations.map((corporation, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleCorporationPress(corporation)}
                      className="mb-3"
                    >
                      {({ pressed }) => (
                        <View
                          className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
                          style={{
                            opacity: pressed ? 0.7 : 1,
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                          }}
                        >
                          <View className="flex-row items-center justify-between">
                            <View className="flex-1 flex-row items-center">
                              <Ionicons name="business" size={20} color="#F97316" />
                              <View className="flex-1 ml-3">
                                <Text className="text-base font-semibold text-gray-900">
                                  {corporation.name}
                                </Text>
                                {corporation.address !== "N/A" && (
                                  <Text className="text-xs text-gray-500 mt-1">
                                    {corporation.address}
                                  </Text>
                                )}
                              </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                          </View>
                        </View>
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
          {/* Navigation Bar */}
          <NavigationBar />

        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
