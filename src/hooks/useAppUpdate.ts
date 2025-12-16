import { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";

/**
 * Hook to check for and apply OTA updates
 *
 * This will work once the app is published through Vibecode.
 * expo-updates is included in the production build.
 *
 * Usage: Call useAppUpdate() in your App.tsx or main component
 */
export function useAppUpdate() {
  const [isChecking, setIsChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const checkForUpdates = useCallback(async () => {
    // Only check in production builds (not in Expo Go or development)
    if (__DEV__) {
      console.log("Update check skipped in development mode");
      return;
    }

    try {
      setIsChecking(true);
      console.log("Checking for updates...");

      // Use require to dynamically load expo-updates at runtime
      // This avoids build-time errors when the module is not available
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Updates = require("expo-updates");

      if (!Updates || !Updates.checkForUpdateAsync) {
        console.log("expo-updates not available");
        setIsChecking(false);
        return;
      }

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setUpdateAvailable(true);
        console.log("Update available, downloading...");

        // Download the update
        await Updates.fetchUpdateAsync();

        // Prompt user to restart the app
        Alert.alert(
          "Update Available",
          "A new version of the app is available. Would you like to restart now to apply the update?",
          [
            {
              text: "Later",
              style: "cancel",
            },
            {
              text: "Restart Now",
              onPress: async () => {
                await Updates.reloadAsync();
              },
            },
          ]
        );
      } else {
        console.log("App is up to date");
      }
    } catch (error) {
      // expo-updates is not available in development/Expo Go
      console.log("Update check not available:", error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Check for updates on app launch
  useEffect(() => {
    checkForUpdates();
  }, [checkForUpdates]);

  return {
    isChecking,
    updateAvailable,
    checkForUpdates,
  };
}
