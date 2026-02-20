
import { Stack } from 'expo-router';
import React from 'react';

export default function HomeLayout() {
  console.log('🏠 HomeLayout: Rendering');
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
