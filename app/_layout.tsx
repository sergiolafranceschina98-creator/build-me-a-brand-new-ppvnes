
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { View, ActivityIndicator, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  console.log('Splash screen already hidden or error preventing auto-hide');
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appReady, setAppReady] = useState(false);
  
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    console.log('🚀 App initializing...');
    console.log('🔗 Backend URL:', Constants.expoConfig?.extra?.backendUrl);
    console.log('📱 Version:', Constants.expoConfig?.version);
    console.log('🎨 Theme:', colorScheme);
    
    // Set app as ready immediately to prevent blank screen
    const timer = setTimeout(() => {
      console.log('⏰ Force setting app as ready');
      setAppReady(true);
      SplashScreen.hideAsync().catch(() => {});
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error) {
      console.error('❌ Font loading error:', error);
      setAppReady(true);
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      console.log('✅ Fonts loaded successfully');
      setAppReady(true);
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded]);

  console.log('🎨 RootLayout rendering - appReady:', appReady, 'loaded:', loaded, 'error:', !!error);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          {!appReady && (
            <View style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              justifyContent: 'center', 
              alignItems: 'center', 
              backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
              zIndex: 9999 
            }}>
              <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} />
            </View>
          )}
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
