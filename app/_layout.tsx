
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

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  console.log('⚠️ Splash screen already hidden');
});

export default function RootLayout() {
  console.log('🚀 RootLayout: Initializing');
  
  const colorScheme = useColorScheme();
  
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    console.log('🚀 RootLayout: Mounted');
    
    // Hide splash screen after a short delay
    const timer = setTimeout(() => {
      console.log('✅ Hiding splash screen');
      SplashScreen.hideAsync().catch((err) => {
        console.log('⚠️ Error hiding splash:', err);
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      console.log('✅ Fonts loaded');
    }
  }, [fontsLoaded]);

  console.log('🎨 RootLayout: Rendering app structure');

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
