
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

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Log backend URL on app start for debugging
    const backendUrl = Constants.expoConfig?.extra?.backendUrl;
    console.log('🚀 App starting with backend URL:', backendUrl);
    console.log('📱 App version:', Constants.expoConfig?.version);
    console.log('🔧 Environment:', __DEV__ ? 'development' : 'production');
  }, []);

  useEffect(() => {
    if (loaded || error) {
      console.log('✅ Fonts loaded, hiding splash screen');
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Don't block rendering - show the app even if fonts aren't loaded yet
  // The app will work fine with system fonts as fallback
  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
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
