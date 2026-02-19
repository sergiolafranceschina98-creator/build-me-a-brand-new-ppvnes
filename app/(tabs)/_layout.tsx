
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
    {
      route: '/(tabs)/profile' as Href,
      label: 'Profile',
      ios_icon_name: 'person.fill',
      android_material_icon_name: 'person',
    },
    {
      route: '/(tabs)/deployment-status' as Href,
      label: 'Deploy',
      ios_icon_name: 'arrow.up.circle.fill',
      android_material_icon_name: 'cloud-upload',
    },
  ];

  return (
    <>
      <Tabs
        tabBar={(props) => <FloatingTabBar {...props} tabs={tabs} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: 'About',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />
        <Tabs.Screen
          name="deployment-status"
          options={{
            title: 'Deployment',
          }}
        />
      </Tabs>
    </>
  );
}
