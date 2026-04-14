import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const NEON_CYAN = '#00f0ff';
const NEON_PURPLE = '#b000ff';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBarFloating,
        tabBarActiveTintColor: NEON_CYAN,
        tabBarInactiveTintColor: '#444444',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true, // Tự động ẩn khi bật bàn phím
        tabBarBackground: () => (
          <View style={styles.tabBarBackground}>
            {/* Dải gradient Tím - Xanh viền mép trên Navbar */}
            <LinearGradient 
              colors={[NEON_PURPLE, NEON_CYAN]} 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}} 
              style={styles.accentLine} 
            />
          </View>
        ),
      }}>
      <Tabs.Screen
        name="quests"
        options={{
          title: 'BỘ LỆNH',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'list-circle' : 'list-circle-outline'} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'HỒ SƠ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'RADAR',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarFloating: {
    position: 'absolute',
    bottom: 20, 
    left: 20,   
    right: 20,  
    height: 65,
    backgroundColor: '#050505',
    borderRadius: 20, 
    borderWidth: 1,
    borderColor: 'rgba(176, 0, 255, 0.4)',
    paddingBottom: Platform.OS === 'ios' ? 15 : 8,
    paddingTop: 8,
    elevation: 20,
    shadowColor: NEON_PURPLE,
    shadowOpacity: 0.8,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  tabBarBackground: {
    flex: 1,
    backgroundColor: '#050505',
    borderRadius: 20,
    overflow: 'hidden',
  },
  accentLine: {
    width: '100%',
    height: 2,
    opacity: 0.9,
  }
});