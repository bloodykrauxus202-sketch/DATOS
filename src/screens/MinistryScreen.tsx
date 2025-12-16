import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { fetchAllMinistryDetails, MinistryDetails } from "../api/googleSheets";
import NavigationBar from "../components/NavigationBar";

type Props = NativeStackScreenProps<RootStackParamList, "Ministry">;

export default function MinistryScreen({ navigation }: Props) {
  const [ministries, setMinistries] = useState<MinistryDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMinistries();
  }, []);

  const loadMinistries = async () => {
    try {
      setLoading(true);
      setError(null);
      const ministryData = await fetchAllMinistryDetails();
      setMinistries(ministryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ministries");
      console.error("Error loading ministries:", err);
    } finally {
      setLoading(false);
    }
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
                  source={require("../../assets/Ministry-1764828817952.jpeg")}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-1">
                  Ministries
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  Active ministries serving the Diocese of Tagum
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
                  <Text className="text-gray-600 mt-4">Loading ministries...</Text>
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
                    onPress={loadMinistries}
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
                    Loading ministries from Google Sheets. Check your internet connection.
                  </Text>
                </View>
              )}

              {!loading && !error && ministries.length === 0 && (
                <View className="bg-gray-50 rounded-3xl p-6 items-center">
                  <Ionicons name="search" size={48} color="#9CA3AF" />
                  <Text className="text-gray-600 text-center mt-4">
                    No ministries found
                  </Text>
                </View>
              )}

              {!loading && !error && ministries.length > 0 && (
                <View>
                  <Text className="text-lg font-bold text-gray-900 mb-4">
                    {ministries.length} {ministries.length === 1 ? "Ministry" : "Ministries"}
                  </Text>
                  {ministries.map((ministry, index) => (
                    <View key={index} className="mb-4">
                      <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                        {/* Ministry Name - Bold */}
                        <View className="flex-row items-start mb-2">
                          <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3 mt-1">
                            <Ionicons name="people" size={16} color="#9333EA" />
                          </View>
                          <View className="flex-1">
                            <Text className="text-lg font-bold text-gray-900 leading-6">
                              {ministry.name}
                            </Text>

                            {/* Coordinator - Regular (not bold) */}
                            {ministry.coordinator && ministry.coordinator !== "N/A" && (
                              <Text className="text-sm text-gray-600 mt-1">
                                {ministry.coordinator}
                              </Text>
                            )}
                          </View>
                        </View>

                        {/* Description */}
                        {ministry.description && ministry.description !== "N/A" && (
                          <View className="mt-3 pl-11">
                            <Text className="text-sm text-gray-700 leading-6">
                              {ministry.description}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
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
