import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { fetchAllDclaimDetails, DclaimDetails } from "../api/googleSheets";
import NavigationBar from "../components/NavigationBar";

type Props = NativeStackScreenProps<RootStackParamList, "LayMovement">;

export default function LayMovementScreen({ navigation }: Props) {
  const [dclaims, setDclaims] = useState<DclaimDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadDclaims();
  }, []);

  const loadDclaims = async () => {
    try {
      setLoading(true);
      setError(null);
      const dclaimData = await fetchAllDclaimDetails();
      setDclaims(dclaimData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load DCLAIM groups");
      console.error("Error loading DCLAIM groups:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
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
                  source={require("../../assets/Lay Movement-1764828815995.jpeg")}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-1">
                  DCLAIM
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  Diocesan Commission for Lay Apostolate, Involvement & Ministry
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
                  <Text className="text-gray-600 mt-4">Loading groups...</Text>
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
                    onPress={loadDclaims}
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
                    Loading DCLAIM groups from Google Sheets. Check your internet connection.
                  </Text>
                </View>
              )}

              {!loading && !error && dclaims.length === 0 && (
                <View className="bg-gray-50 rounded-3xl p-6 items-center">
                  <Ionicons name="search" size={48} color="#9CA3AF" />
                  <Text className="text-gray-600 text-center mt-4">
                    No groups found
                  </Text>
                </View>
              )}

              {!loading && !error && dclaims.length > 0 && (
                <View>
                  <Text className="text-lg font-bold text-gray-900 mb-4">
                    {dclaims.length} {dclaims.length === 1 ? "Group" : "Groups/Movements"}
                  </Text>
                  {dclaims.map((dclaim, index) => (
                    <Pressable
                      key={index}
                      onPress={() => toggleExpand(index)}
                      className="mb-3"
                    >
                      {({ pressed }) => (
                        <View
                          className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm"
                          style={{
                            opacity: pressed ? 0.7 : 1,
                          }}
                        >
                          <View className="flex-row items-center justify-between">
                            <View className="flex-1 flex-row items-center">
                              <Ionicons name="people" size={20} color="#8B5CF6" />
                              <View className="flex-1 ml-3">
                                <Text className="text-base font-semibold text-gray-900">
                                  {dclaim.name}
                                </Text>
                              </View>
                            </View>
                            <Ionicons
                              name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                              size={20}
                              color="#9CA3AF"
                            />
                          </View>

                          {/* Expanded Description */}
                          {expandedIndex === index && dclaim.description !== "N/A" && (
                            <View className="mt-3 pt-3 border-t border-gray-100">
                              <Text className="text-sm text-gray-600 leading-6">
                                {dclaim.description}
                              </Text>
                            </View>
                          )}
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
