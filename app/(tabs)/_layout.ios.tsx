
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="about" name="about">
        <Icon sf="info.circle.fill" />
        <Label>About</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
