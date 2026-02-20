
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { View, Text, ActivityIndicator, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  console.log('⚠️ Splash screen already hidden or error preventing auto-hide');
});

export default function RootLayout() {
  console.log('🚀 RootLayout: Component initializing');
  
  const colorScheme = useColorScheme();
  const [appReady, setAppReady] = useState(false);
  
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Force app ready after a short timeout to prevent blank screens
  useEffect(() => {
    console.log('🚀 RootLayout: Initial mount effect');
    console.log('🔗 Backend URL:', Constants.expoConfig?.extra?.backendUrl);
    console.log('📱 App Version:', Constants.expoConfig?.version);
    console.log('🎨 Color Scheme:', colorScheme);
    
    const timer = setTimeout(() => {
      console.log('⏰ RootLayout: Force setting app as ready (timeout)');
      setAppReady(true);
      SplashScreen.hideAsync().catch((err) => {
        console.log('⚠️ Error hiding splash screen:', err);
      });
    }, 150);
    
    return () => {
      console.log('🧹 RootLayout: Cleanup timeout');
      clearTimeout(timer);
    };
  }, []);

  // Handle font loading errors
  useEffect(() => {
    if (fontError) {
      console.error('❌ RootLayout: Font loading error:', fontError);
      setAppReady(true);
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontError]);

  // Handle successful font loading
  useEffect(() => {
    if (fontsLoaded) {
      console.log('✅ RootLayout: Fonts loaded successfully');
      setAppReady(true);
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  console.log('🎨 RootLayout: Rendering - appReady:', appReady, 'fontsLoaded:', fontsLoaded, 'fontError:', !!fontError);

  // Always render the app structure, just show a loading overlay if not ready
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
              <Text style={{ 
                color: colorScheme === 'dark' ? '#fff' : '#000', 
                marginTop: 16,
                fontSize: 16,
                fontWeight: '600'
              }}>
                Loading AI Workout Builder...
              </Text>
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
