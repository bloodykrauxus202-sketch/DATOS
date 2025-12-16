import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator, TextInput, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { fetchAllParishDetails, ParishDetails } from "../api/googleSheets";
import NavigationBar from "../components/NavigationBar";

type Props = NativeStackScreenProps<RootStackParamList, "Parish">;

export default function ParishScreen({ navigation }: Props) {
  const [parishes, setParishes] = useState<ParishDetails[]>([]);
  const [filteredParishes, setFilteredParishes] = useState<ParishDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadParishes();
  }, []);

  useEffect(() => {
    // Filter parishes based on search query
    if (searchQuery.trim() === "") {
      setFilteredParishes(parishes);
    } else {
      const filtered = parishes.filter((parish) =>
        parish.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredParishes(filtered);
    }
  }, [searchQuery, parishes]);

  const loadParishes = async () => {
    try {
      setLoading(true);
      setError(null);
      const parishData = await fetchAllParishDetails();
      setParishes(parishData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load parishes");
      console.error("Error loading parishes:", err);
    } finally {
      setLoading(false);
    }
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
                  source={require("../../assets/Parish-1764828819730.jpeg")}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-1">
                  Parishes
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  All parishes within the Diocese of Tagum
                </Text>
              </View>
            </View>
          </View>

          {/* Search Bar */}
          <View className="px-6 py-4 border-b border-gray-100">
            <View className="bg-white rounded-2xl border border-gray-200 flex-row items-center px-4 py-3">
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-900"
                placeholder="Search parishes..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </Pressable>
              )}
            </View>
          </View>

          {/* Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={() => Keyboard.dismiss()}
          >
            <View className="px-6 py-6">
              {loading && (
                <View className="items-center justify-center py-20">
                  <ActivityIndicator size="large" color="#3B82F6" />
                  <Text className="text-gray-600 mt-4">Loading parishes...</Text>
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
                    onPress={loadParishes}
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
                    Loading parishes from Google Sheets. Check your internet connection.
                  </Text>
                </View>
              )}

              {!loading && !error && parishes.length === 0 && (
                <View className="bg-gray-50 rounded-3xl p-6 items-center">
                  <Ionicons name="search" size={48} color="#9CA3AF" />
                  <Text className="text-gray-600 text-center mt-4">
                    No parishes found
                  </Text>
                </View>
              )}

              {!loading && !error && parishes.length > 0 && (
                <View>
                  {searchQuery.trim() !== "" && (
                    <Text className="text-sm text-gray-600 mb-4">
                      Found {filteredParishes.length} {filteredParishes.length === 1 ? "parish" : "parishes"} matching &ldquo;{searchQuery}&rdquo;
                    </Text>
                  )}
                  {!searchQuery.trim() && (
                    <Text className="text-lg font-bold text-gray-900 mb-4">
                      {parishes.length} {parishes.length === 1 ? "Parish" : "Parishes"}
                    </Text>
                  )}
                  {filteredParishes.length === 0 ? (
                    <View className="bg-gray-50 rounded-3xl p-6 items-center">
                      <Ionicons name="search-outline" size={48} color="#9CA3AF" />
                      <Text className="text-gray-600 text-center mt-4">
                        No parishes match your search
                      </Text>
                      <Pressable
                        onPress={() => setSearchQuery("")}
                        className="mt-4 bg-blue-600 py-2 px-6 rounded-xl"
                      >
                        <Text className="text-white font-semibold">Clear Search</Text>
                      </Pressable>
                    </View>
                  ) : (
                    filteredParishes.map((parish, index) => (
                      <Pressable
                        key={index}
                        onPress={() => handleParishPress(parish)}
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
                                <Ionicons name="business" size={20} color="#3B82F6" />
                                <View className="flex-1 ml-3">
                                  <Text className="text-base font-semibold text-gray-900">
                                    {parish.name}
                                  </Text>
                                  {parish.location !== "N/A" && (
                                    <Text className="text-xs text-gray-500 mt-1">
                                      {parish.location}
                                    </Text>
                                  )}
                                </View>
                              </View>
                              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </View>
                          </View>
                        )}
                      </Pressable>
                    ))
                  )}
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
