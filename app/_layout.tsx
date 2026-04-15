import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { initializeDailyQuests } from './utils/questSystem';
import { LinearGradient } from 'expo-linear-gradient';

const THEME_BLUE_DARK = '#0055ff';
const THEME_BLUE_LIGHT = '#00aaff';
const THEME_ALERT_RED = '#ff003c';

export default function RootLayout() {
  const [popupQuest, setPopupQuest] = useState<any>(null);
  const scanlineAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initializeDailyQuests();

    const systemScanner = setInterval(async () => {
      try {
        const storedData = await AsyncStorage.getItem('@daily_quests');
        if (storedData) {
          const data = JSON.parse(storedData);
          const now = Date.now();
          const pendingQuest = data.quests.find((q: any) => now >= q.triggerTime && !q.isNotified);
          
          if (pendingQuest && !popupQuest) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            setPopupQuest(pendingQuest);
            Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
          }
        }
      } catch (e) {
        console.error("Lỗi quét hệ thống:", e);
      }
    }, 5000);

    return () => clearInterval(systemScanner);
  }, [popupQuest]);

  useEffect(() => {
    if (popupQuest) {
      Animated.loop(
        Animated.timing(scanlineAnim, { toValue: 1, duration: 2500, easing: Easing.linear, useNativeDriver: true })
      ).start();
    } else {
      scanlineAnim.setValue(0);
    }
  }, [popupQuest]);

  const handleAcceptQuest = async () => {
    if (!popupQuest) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      const storedData = await AsyncStorage.getItem('@daily_quests');
      if (storedData) {
        let data = JSON.parse(storedData);
        data.quests = data.quests.map((q: any) => 
          q.id === popupQuest.id ? { ...q, isNotified: true } : q
        );
        await AsyncStorage.setItem('@daily_quests', JSON.stringify(data));
      }
      Animated.timing(opacityAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setPopupQuest(null));
    } catch (e) {
      console.error("Lỗi đồng bộ bộ lệnh:", e);
    }
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#020202' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="light" />

      <Modal visible={!!popupQuest} transparent={true} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.hologramBox, { opacity: opacityAnim }]}>
            <Animated.View style={[styles.scanline, { transform: [{ translateY: scanlineAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 320] }) }] }]} />
            <View style={styles.cornerTL} /><View style={styles.cornerTR} /><View style={styles.cornerBL} /><View style={styles.cornerBR} />

            <Text style={styles.warningTitle}>⚠️ PHÁT ĐỘNG BỘ LỆNH ⚠️</Text>
            
            <View style={styles.questDetailBox}>
              <Text style={styles.questTitle}>[{popupQuest?.title}]</Text>
              <Text style={styles.questDesc}>{popupQuest?.description}</Text>
              <View style={styles.divider} />
              <View style={styles.rewardRow}>
                <Text style={styles.infoLabel}>TIẾN TRÌNH:</Text>
                <Text style={styles.infoValue}>+{popupQuest?.reward} {popupQuest?.statName}</Text>
              </View>
              <View style={styles.rewardRow}>
                <Text style={styles.infoLabel}>THỜI HẠN:</Text>
                <Text style={[styles.infoValue, { color: THEME_ALERT_RED }]}>23:00 HÔM NAY</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptQuest}>
              <LinearGradient colors={[THEME_BLUE_DARK, THEME_BLUE_LIGHT]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
                <Text style={styles.acceptButtonText}>TIẾP NHẬN BỘ LỆNH</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center', padding: 25 },
  hologramBox: { width: '100%', backgroundColor: '#050505', borderWidth: 1, borderColor: THEME_BLUE_LIGHT, padding: 25, position: 'relative', overflow: 'hidden', shadowColor: THEME_BLUE_LIGHT, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  scanline: { position: 'absolute', top: 0, left: 0, width: '100%', height: 4, backgroundColor: THEME_BLUE_LIGHT, opacity: 0.15, zIndex: 5 },
  cornerTL: { position: 'absolute', top: -2, left: -2, width: 20, height: 20, borderTopWidth: 4, borderLeftWidth: 4, borderColor: THEME_BLUE_LIGHT },
  cornerTR: { position: 'absolute', top: -2, right: -2, width: 20, height: 20, borderTopWidth: 4, borderRightWidth: 4, borderColor: THEME_BLUE_LIGHT },
  cornerBL: { position: 'absolute', bottom: -2, left: -2, width: 20, height: 20, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: THEME_BLUE_LIGHT },
  cornerBR: { position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderBottomWidth: 4, borderRightWidth: 4, borderColor: THEME_BLUE_LIGHT },
  warningTitle: { color: THEME_BLUE_LIGHT, fontSize: 16, fontWeight: '900', textAlign: 'center', marginBottom: 25, letterSpacing: 2, fontFamily: 'monospace' },
  questDetailBox: { backgroundColor: 'rgba(0, 170, 255, 0.05)', padding: 20, borderWidth: 1, borderColor: 'rgba(0, 170, 255, 0.2)', marginBottom: 30 },
  questTitle: { color: '#fff', fontSize: 20, fontWeight: '900', marginBottom: 12, textAlign: 'center' },
  questDesc: { color: '#ccc', fontSize: 15, textAlign: 'center', marginBottom: 20, lineHeight: 22, fontStyle: 'italic' },
  divider: { height: 1, backgroundColor: 'rgba(0, 170, 255, 0.2)', marginVertical: 15 },
  rewardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  infoLabel: { color: '#666', fontSize: 12, fontWeight: 'bold' },
  infoValue: { color: THEME_BLUE_LIGHT, fontSize: 13, fontWeight: '900' },
  acceptButton: { width: '100%', height: 55, borderRadius: 2 },
  gradientButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  acceptButtonText: { color: '#000', fontWeight: '900', fontSize: 15, letterSpacing: 2 }
});