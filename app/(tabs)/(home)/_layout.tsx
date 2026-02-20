
import { Stack } from 'expo-router';

export default function HomeLayout() {
  console.log('🏠 HomeLayout rendering');
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
