import React, { useState, useEffect } from "react";
import { View, Pressable, Modal, TextInput, ScrollView, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import AboutModal from "./AboutModal";
import { fetchAllParishDetails, fetchAllBECDetails, fetchAllSchoolDetails, fetchAllCongregationDetails, fetchAllCorporationDetails, fetchAllDclaimDetails } from "../api/googleSheets";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface NavigationBarProps {
  canGoBack?: boolean;
  canGoForward?: boolean;
}

interface SearchResult {
  type: 'parish' | 'bec' | 'school' | 'congregation' | 'corporation' | 'dclaim';
  title: string;
  subtitle: string;
  icon: string;
  data: any;
}

export default function NavigationBar({ canGoBack = true, canGoForward = false }: NavigationBarProps) {
  const navigation = useNavigation<NavigationProp>();
  const [showAbout, setShowAbout] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allData, setAllData] = useState<any>({
    parishes: [],
    becs: [],
    schools: [],
    congregations: [],
    corporations: [],
    dclaims: [],
  });

  // Check if we can actually go back
  const canActuallyGoBack = canGoBack && navigation.canGoBack();

  // Load all data when search is opened
  useEffect(() => {
    if (showSearch && allData.parishes.length === 0) {
      loadAllData();
    }
  }, [showSearch]);

  const loadAllData = async () => {
    try {
      const [parishes, becs, schools, congregations, corporations, dclaims] = await Promise.all([
        fetchAllParishDetails().catch(() => []),
        fetchAllBECDetails().catch(() => []),
        fetchAllSchoolDetails().catch(() => []),
        fetchAllCongregationDetails().catch(() => []),
        fetchAllCorporationDetails().catch(() => []),
        fetchAllDclaimDetails().catch(() => []),
      ]);

      setAllData({
        parishes,
        becs,
        schools,
        congregations,
        corporations,
        dclaims,
      });
    } catch (error) {
      console.error("Error loading search data:", error);
    }
  };

  // Search through all data
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search parishes
    allData.parishes.forEach((parish: any) => {
      if (
        parish.name?.toLowerCase().includes(query) ||
        parish.location?.toLowerCase().includes(query) ||
        parish.vicariate?.toLowerCase().includes(query) ||
        parish.parishPriest?.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'parish',
          title: parish.name,
          subtitle: parish.location || parish.vicariate || 'Parish',
          icon: 'business',
          data: parish,
        });
      }
    });

    // Search BECs
    allData.becs.forEach((bec: any) => {
      if (
        bec.name?.toLowerCase().includes(query) ||
        bec.parish?.toLowerCase().includes(query) ||
        bec.location?.toLowerCase().includes(query) ||
        bec.president?.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'bec',
          title: bec.name,
          subtitle: bec.parish || 'BEC',
          icon: 'home',
          data: bec,
        });
      }
    });

    // Search schools
    allData.schools.forEach((school: any) => {
      if (
        school.name?.toLowerCase().includes(query) ||
        school.location?.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'school',
          title: school.name,
          subtitle: school.location || 'School',
          icon: 'school',
          data: school,
        });
      }
    });

    // Search congregations
    allData.congregations.forEach((congregation: any) => {
      if (
        congregation.name?.toLowerCase().includes(query) ||
        congregation.address?.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'congregation',
          title: congregation.name,
          subtitle: congregation.address || 'Congregation',
          icon: 'people-circle',
          data: congregation,
        });
      }
    });

    // Search corporations
    allData.corporations.forEach((corporation: any) => {
      if (
        corporation.name?.toLowerCase().includes(query) ||
        corporation.address?.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'corporation',
          title: corporation.name,
          subtitle: corporation.address || 'Corporation',
          icon: 'business',
          data: corporation,
        });
      }
    });

    // Search DCLAIM
    allData.dclaims.forEach((dclaim: any) => {
      if (
        dclaim.name?.toLowerCase().includes(query) ||
        dclaim.description?.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'dclaim',
          title: dclaim.name,
          subtitle: 'DCLAIM Group',
          icon: 'people',
          data: dclaim,
        });
      }
    });

    setSearchResults(results);
    setIsSearching(false);
  }, [searchQuery, allData]);

  const handleResultPress = (result: SearchResult) => {
    setShowSearch(false);
    setSearchQuery("");

    // Navigate to the appropriate detail screen
    switch (result.type) {
      case 'parish':
        navigation.navigate('ParishDetail', { parish: result.data });
        break;
      case 'bec':
        navigation.navigate('BECDetail', { bec: result.data });
        break;
      case 'school':
        navigation.navigate('SchoolDetail', { school: result.data });
        break;
      case 'congregation':
        navigation.navigate('CongregationDetail', { congregation: result.data });
        break;
      case 'corporation':
        navigation.navigate('CorporationDetail', { corporation: result.data });
        break;
      case 'dclaim':
        // DCLAIM doesn't have detail screen, just show in list
        navigation.navigate('LayMovement');
        break;
    }
  };

  return (
    <>
      {/* Elevated Navigation Bar */}
      <View
        className="bg-white border-t border-gray-200"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View className="flex-row items-center justify-around py-4 px-4">
          {/* Back Button */}
          <Pressable
            onPress={() => canActuallyGoBack && navigation.goBack()}
            disabled={!canActuallyGoBack}
            className="items-center justify-center w-16 h-16 rounded-xl"
          >
            {({ pressed }) => (
              <View
                className="items-center justify-center w-full h-full rounded-xl"
                style={{
                  backgroundColor: pressed ? "#EFF6FF" : "transparent",
                }}
              >
                <Ionicons
                  name="arrow-back"
                  size={32}
                  color={canActuallyGoBack ? (pressed ? "#2563EB" : "#3B82F6") : "#D1D5DB"}
                />
              </View>
            )}
          </Pressable>

          {/* Forward Button */}
          <Pressable
            onPress={() => {
              // Forward functionality would require navigation history tracking
            }}
            disabled={!canGoForward}
            className="items-center justify-center w-16 h-16 rounded-xl"
          >
            {({ pressed }) => (
              <View
                className="items-center justify-center w-full h-full rounded-xl"
                style={{
                  backgroundColor: pressed ? "#EFF6FF" : "transparent",
                }}
              >
                <Ionicons
                  name="arrow-forward"
                  size={32}
                  color={canGoForward ? (pressed ? "#2563EB" : "#3B82F6") : "#D1D5DB"}
                />
              </View>
            )}
          </Pressable>

          {/* Home Button */}
          <Pressable
            onPress={() => navigation.navigate("Directory")}
            className="items-center justify-center w-16 h-16 rounded-xl"
          >
            {({ pressed }) => (
              <View
                className="items-center justify-center w-full h-full rounded-xl"
                style={{
                  backgroundColor: pressed ? "#EFF6FF" : "transparent",
                }}
              >
                <Ionicons
                  name="home"
                  size={32}
                  color={pressed ? "#2563EB" : "#3B82F6"}
                />
              </View>
            )}
          </Pressable>

          {/* Search Button */}
          <Pressable
            onPress={() => setShowSearch(true)}
            className="items-center justify-center w-16 h-16 rounded-xl"
          >
            {({ pressed }) => (
              <View
                className="items-center justify-center w-full h-full rounded-xl"
                style={{
                  backgroundColor: pressed ? "#EFF6FF" : "transparent",
                }}
              >
                <Ionicons
                  name="search"
                  size={32}
                  color={pressed ? "#2563EB" : "#3B82F6"}
                />
              </View>
            )}
          </Pressable>

          {/* About Button */}
          <Pressable
            onPress={() => setShowAbout(true)}
            className="items-center justify-center w-16 h-16 rounded-xl"
          >
            {({ pressed }) => (
              <View
                className="items-center justify-center w-full h-full rounded-xl"
                style={{
                  backgroundColor: pressed ? "#EFF6FF" : "transparent",
                }}
              >
                <Ionicons
                  name="information-circle"
                  size={32}
                  color={pressed ? "#2563EB" : "#3B82F6"}
                />
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* Global Search Modal */}
      <Modal
        visible={showSearch}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSearch(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setShowSearch(false)}
        >
          <Pressable
            className="bg-white rounded-t-3xl mt-20 flex-1"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="p-6 border-b border-gray-200">
              <View className="flex-row items-center mb-4">
                <Text className="text-2xl font-bold text-gray-900 flex-1">
                  Search Everything
                </Text>
                <Pressable
                  onPress={() => setShowSearch(false)}
                  className="w-10 h-10 items-center justify-center"
                >
                  {({ pressed }) => (
                    <Ionicons
                      name="close"
                      size={28}
                      color={pressed ? "#2563EB" : "#3B82F6"}
                    />
                  )}
                </Pressable>
              </View>

              <View className="bg-gray-100 rounded-2xl flex-row items-center px-4 py-3">
                <Ionicons name="search" size={20} color="#9CA3AF" />
                <TextInput
                  className="flex-1 ml-3 text-base text-gray-900"
                  placeholder="Search parishes, BECs, schools, and more..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => setSearchQuery("")}>
                    <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                  </Pressable>
                )}
              </View>

              {searchQuery.trim() === "" && (
                <Text className="text-sm text-gray-500 mt-3">
                  Search for parishes, GKK names, priests, schools, congregations, and more
                </Text>
              )}
            </View>

            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
            >
              <View className="p-6">
                {isSearching && (
                  <View className="items-center py-12">
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text className="text-gray-600 mt-4">Searching...</Text>
                  </View>
                )}

                {!isSearching && searchQuery.trim() !== "" && searchResults.length === 0 && (
                  <View className="items-center py-12">
                    <Ionicons name="search-outline" size={64} color="#D1D5DB" />
                    <Text className="text-gray-600 text-center mt-4 font-semibold">
                      No results found
                    </Text>
                    <Text className="text-gray-500 text-center mt-2">
                      Try searching for a different parish, BEC, or school name
                    </Text>
                  </View>
                )}

                {!isSearching && searchResults.length > 0 && (
                  <>
                    <Text className="text-sm text-gray-600 mb-4">
                      Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                    </Text>
                    {searchResults.map((result, index) => (
                      <Pressable
                        key={index}
                        onPress={() => handleResultPress(result)}
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
                            <View className="flex-row items-center">
                              <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center mr-4">
                                <Ionicons name={result.icon as any} size={24} color="#3B82F6" />
                              </View>
                              <View className="flex-1">
                                <Text className="text-base font-semibold text-gray-900">
                                  {result.title}
                                </Text>
                                <Text className="text-sm text-gray-500 mt-1">
                                  {result.subtitle}
                                </Text>
                              </View>
                              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
                            </View>
                          </View>
                        )}
                      </Pressable>
                    ))}
                  </>
                )}
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* About Modal */}
      <AboutModal visible={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
}
