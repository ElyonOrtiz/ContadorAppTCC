import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index" // Tela inicial (index.tsx) oculta na aba
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="historico" // Tela de histórico
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color }) => <Feather size={28} name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calcular" // Tela de cálculo – acionada pelo botão “plus”
        options={{
          title: 'Calcular',
          tabBarIcon: ({ color }) => <Feather size={28} name="plus" color={color} />,
        }}
      />
    </Tabs>
  );
}
