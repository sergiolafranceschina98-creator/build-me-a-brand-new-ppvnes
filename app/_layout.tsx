
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Log backend URL on app start for debugging
    const backendUrl = Constants.expoConfig?.extra?.backendUrl;
    console.log('🚀 App starting with backend URL:', backendUrl);
    console.log('📱 App version:', Constants.expoConfig?.version);
    console.log('🔧 Environment:', __DEV__ ? 'development' : 'production');
    
    if (error) {
      console.error('Font loading error:', error);
      SplashScreen.hideAsync();
      setIsReady(true);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      console.log('✅ Fonts loaded successfully');
      SplashScreen.hideAsync();
      // Small delay to ensure everything is ready
      setTimeout(() => {
        setIsReady(true);
      }, 100);
    }
  }, [loaded]);

  // Fallback timeout - if fonts don't load within 5 seconds, show the app anyway
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isReady) {
        console.warn('⚠️ Font loading timeout - proceeding anyway');
        SplashScreen.hideAsync();
        setIsReady(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isReady]);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading AI Workout Builder...</Text>
      </View>
    );
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
});
