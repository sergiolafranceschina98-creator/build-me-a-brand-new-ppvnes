
import { Tabs } from 'expo-router';
import React from 'react';
import FloatingTabBar from '@/components/FloatingTabBar';
import { Href } from 'expo-router';

interface TabBarItem {
  route: Href;
  label: string;
  ios_icon_name: string;
  android_material_icon_name: string;
}

export default function TabLayout() {
  console.log('📱 TabLayout (iOS) rendering - START');
  
  const tabs: TabBarItem[] = [
    {
      route: '/(tabs)/(home)' as Href,
      label: 'Home',
      ios_icon_name: 'house.fill',
      android_material_icon_name: 'home',
    },
    {
      route: '/(tabs)/about' as Href,
      label: 'About',
      ios_icon_name: 'info.circle.fill',
      android_material_icon_name: 'info',
    },
  ];

  console.log('📱 TabLayout (iOS) tabs configured:', tabs.length, 'tabs');

  return (
    <Tabs
      tabBar={(props) => {
        console.log('📱 FloatingTabBar (iOS) rendering with props');
        return <FloatingTabBar {...props} tabs={tabs} />;
      }}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
