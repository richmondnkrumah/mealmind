// app/(tabs)/settings/_layout.tsx

import { Stack } from 'expo-router';
import React from 'react';

export default function SettingsStackLayout() {
  return (
    <Stack>
      
      <Stack.Screen
        name="upgrade"
        options={{
          headerTitle: 'Upgrade to Plus',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="theme"
        options={{
          headerTitle: 'Appearance',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          headerTitle: 'Language',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          headerTitle: 'Notifications & Sounds',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}