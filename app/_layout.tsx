
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  console.log('⚠️ Splash screen already hidden');
});

export default function RootLayout() {
  console.log('🚀 RootLayout: Initializing with DARK theme');
  
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    console.log('🚀 RootLayout: Mounted');
    
    // Hide splash screen immediately
    const timer = setTimeout(() => {
      console.log('✅ Hiding splash screen');
      SplashScreen.hideAsync().catch((err) => {
        console.log('⚠️ Error hiding splash:', err);
      });
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      console.log('✅ Fonts loaded successfully');
    }
    if (fontError) {
      console.error('❌ Font loading error:', fontError);
    }
  }, [fontsLoaded, fontError]);

  // ALWAYS render - don't wait for fonts
  console.log('🎨 RootLayout: Rendering app structure with DARK theme (fonts loaded:', fontsLoaded, ', error:', !!fontError, ')');

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider value={DarkTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="create-client" options={{ headerShown: false }} />
              <Stack.Screen name="client/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="program/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="light" />
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
