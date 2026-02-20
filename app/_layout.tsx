
import "react-native-reanimated";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme, View, ActivityIndicator } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { WidgetProvider } from "@/contexts/WidgetContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) {
      console.error('Font loading error:', error);
      // Hide splash screen even if fonts fail to load
      SplashScreen.hideAsync();
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      console.log('Fonts loaded successfully');
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "rgb(0, 122, 255)",
      background: "rgb(242, 242, 247)",
      card: "rgb(255, 255, 255)",
      text: "rgb(0, 0, 0)",
      border: "rgb(216, 216, 220)",
      notification: "rgb(255, 59, 48)",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "rgb(10, 132, 255)",
      background: "rgb(1, 1, 1)",
      card: "rgb(28, 28, 30)",
      text: "rgb(255, 255, 255)",
      border: "rgb(44, 44, 46)",
      notification: "rgb(255, 69, 58)",
    },
  };

  // Show a loading indicator instead of returning null
  if (!loaded && !error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? '#0A0A0F' : '#F8F9FA' }}>
        <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#FF6B35' : '#007AFF'} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider
        value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
      >
        <WidgetProvider>
          <StatusBar style="auto" animated />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="client/[id]" 
              options={{ 
                headerShown: true,
                title: 'Client Details',
                presentation: 'card'
              }} 
            />
            <Stack.Screen 
              name="program/[id]" 
              options={{ 
                headerShown: true,
                title: 'Program Details',
                presentation: 'card'
              }} 
            />
            <Stack.Screen 
              name="create-client" 
              options={{ 
                headerShown: true,
                title: 'Create Client',
                presentation: 'modal'
              }} 
            />
            <Stack.Screen 
              name="+not-found" 
              options={{ 
                headerShown: true,
                title: 'Not Found'
              }} 
            />
          </Stack>
          <SystemBars style="auto" />
        </WidgetProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
