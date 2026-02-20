
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore errors if splash screen is already hidden
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Log app initialization
    const backendUrl = Constants.expoConfig?.extra?.backendUrl;
    console.log('🚀 App initializing...');
    console.log('🔗 Backend URL:', backendUrl);
    console.log('📱 Version:', Constants.expoConfig?.version);
    console.log('🎨 Theme:', colorScheme);
  }, []);

  useEffect(() => {
    if (error) {
      console.error('❌ Font loading error:', error);
      // Hide splash and continue with system fonts
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      console.log('✅ Fonts loaded, hiding splash screen');
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded]);

  // Don't block rendering - show app immediately
  // Fonts will load in background and app will work with system fonts as fallback
  if (!loaded && !error) {
    // Still loading fonts, but don't block
    return null;
  }

  console.log('🎨 RootLayout rendering');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="create-client" options={{ headerShown: false }} />
            <Stack.Screen name="client/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="program/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
