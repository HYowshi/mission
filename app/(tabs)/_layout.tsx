import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const NEON_CYAN = '#00f0ff';
const NEON_PURPLE = '#b000ff';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: NEON_CYAN,
        tabBarInactiveTintColor: '#444444',
        tabBarStyle: styles.tabBarFloating,
        tabBarHideOnKeyboard: true,
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={styles.androidBackground} />
          )
        ),
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      
      <Tabs.Screen
        name="quests"
        options={{
          title: 'BỘ LỆNH',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && { shadowColor: color }]}>
              <Ionicons name={focused ? 'list-circle' : 'list-circle-outline'} size={26} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'HỒ SƠ',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && { shadowColor: color }]}>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={26} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: 'RADAR',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && { shadowColor: color }]}>
              <Ionicons name={focused ? 'map' : 'map-outline'} size={26} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarFloating: {
    position: 'absolute',
    bottom: 25, 
    left: 20,   
    right: 20,  
    height: 65,
    elevation: 20,
    backgroundColor: 'rgba(5, 5, 5, 0.75)', 
    borderRadius: 20, 
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)', 
    borderTopWidth: 1, 
    paddingBottom: Platform.OS === 'ios' ? 15 : 8,
    paddingTop: 8,
    overflow: 'hidden',
    shadowColor: NEON_CYAN,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  androidBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 5, 5, 0.95)',
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
});