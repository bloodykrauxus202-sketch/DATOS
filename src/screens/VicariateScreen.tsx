import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { fetchAllParishDetails, ParishDetails } from "../api/googleSheets";
import NavigationBar from "../components/NavigationBar";

type Props = NativeStackScreenProps<RootStackParamList, "Vicariate">;

interface VicariateWithParishes {
  name: string;
  parishes: ParishDetails[];
}

export default function VicariateScreen({ navigation }: Props) {
  const [vicariates, setVicariates] = useState<VicariateWithParishes[]>([]);
  const [expandedVicariate, setExpandedVicariate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVicariates();
  }, []);

  const loadVicariates = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all parish details
      const allParishes = await fetchAllParishDetails();

      // Group parishes by vicariate
      const vicariateMap = new Map<string, ParishDetails[]>();

      allParishes.forEach((parish) => {
        const vicariateName = parish.vicariate;
        if (vicariateName && vicariateName !== "N/A") {
          if (!vicariateMap.has(vicariateName)) {
            vicariateMap.set(vicariateName, []);
          }
          vicariateMap.get(vicariateName)?.push(parish);
        }
      });

      // Convert map to array and sort by vicariate name
      const vicariateArray: VicariateWithParishes[] = Array.from(vicariateMap.entries())
        .map(([name, parishes]) => ({ name, parishes }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setVicariates(vicariateArray);
      console.log(`Loaded ${vicariateArray.length} vicariates`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load vicariates");
      console.error("Error loading vicariates:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVicariate = (vicariateName: string) => {
    setExpandedVicariate(expandedVicariate === vicariateName ? null : vicariateName);
  };

  const handleParishPress = (parish: ParishDetails) => {
    navigation.navigate("ParishDetail", { parish });
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
                  source={require("../../assets/Vicariate-1764828832821.jpeg")}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-1">
                  Vicariates
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  Vicariate structure within the Diocese of Tagum
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
                  <Text className="text-gray-600 mt-4">Loading vicariates...</Text>
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
                    onPress={loadVicariates}
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
                    Loading vicariates from Google Sheets. Check your internet connection and API key.
                  </Text>
                </View>
              )}

              {!loading && !error && vicariates.length === 0 && (
                <View className="bg-gray-50 rounded-3xl p-6 items-center">
                  <Ionicons name="search" size={48} color="#9CA3AF" />
                  <Text className="text-gray-600 text-center mt-4">
                    No vicariates found
                  </Text>
                </View>
              )}

              {!loading && !error && vicariates.length > 0 && (
                <View>
                  <Text className="text-lg font-bold text-gray-900 mb-4">
                    {vicariates.length} {vicariates.length === 1 ? "Vicariate" : "Vicariates"}
                  </Text>
                  {vicariates.map((vicariate, index) => {
                    const isExpanded = expandedVicariate === vicariate.name;
                    return (
                      <View key={index} className="mb-3">
                        {/* Vicariate Header - Clickable */}
                        <Pressable onPress={() => toggleVicariate(vicariate.name)}>
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
                                  <Ionicons name="map" size={20} color="#10B981" />
                                  <View className="flex-1 ml-3">
                                    <Text className="text-base font-semibold text-gray-900">
                                      {vicariate.name}
                                    </Text>
                                    <Text className="text-xs text-gray-500 mt-1">
                                      {vicariate.parishes.length} {vicariate.parishes.length === 1 ? "parish" : "parishes"}
                                    </Text>
                                  </View>
                                </View>
                                <Ionicons
                                  name={isExpanded ? "chevron-up" : "chevron-down"}
                                  size={20}
                                  color="#9CA3AF"
                                />
                              </View>
                            </View>
                          )}
                        </Pressable>

                        {/* Parish List - Dropdown */}
                        {isExpanded && (
                          <View className="mt-2 ml-4">
                            {vicariate.parishes.map((parish, parishIndex) => (
                              <Pressable
                                key={parishIndex}
                                onPress={() => handleParishPress(parish)}
                                className="mb-2"
                              >
                                {({ pressed }) => (
                                  <View
                                    className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                                    style={{
                                      opacity: pressed ? 0.7 : 1,
                                    }}
                                  >
                                    <View className="flex-row items-center">
                                      <Ionicons name="business-outline" size={16} color="#3B82F6" />
                                      <Text className="text-sm text-gray-900 ml-2 flex-1">
                                        {parish.name}
                                      </Text>
                                      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                                    </View>
                                  </View>
                                )}
                              </Pressable>
                            ))}
                          </View>
                        )}
                      </View>
                    );
                  })}
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
