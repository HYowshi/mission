// components/RadarMap.web.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const THEME_BLUE_DARK = '#0055ff';
const THEME_BLUE_LIGHT = '#00aaff';
const THEME_ALERT_RED = '#ff003c';

export default function RadarMapWeb() {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.timing(pulseAnim, { toValue: 1, duration: 4000, easing: Easing.out(Easing.ease), useNativeDriver: false })).start();
    Animated.loop(Animated.timing(rotateAnim, { toValue: 1, duration: 6000, easing: Easing.linear, useNativeDriver: false })).start();
  }, []);

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>[ RADAR TOÀN CẦU ]</Text>
      
      <View style={styles.webFallbackBox}>
        <Text style={styles.webFallbackTitle}>⚠️ OFFLINE TRÊN WEB ⚠️</Text>
        <Text style={styles.webFallbackText}>Lõi Google Maps yêu cầu module vật lý di động.</Text>
        <Text style={styles.webFallbackText}>Ký chủ hãy kết nối thiết bị Di động thông qua ứng dụng Expo Go để kích hoạt Bản đồ thực tế.</Text>
      </View>

      <View style={styles.radarWrapper}>
        <View style={styles.radarOverlay} pointerEvents="none">
          <View style={styles.radarContainer}>
            <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.1, 3] }) }], opacity: pulseAnim.interpolate({ inputRange: [0, 0.8, 1], outputRange: [0.5, 0.1, 0] }) }]} />
            <Animated.View style={[styles.radarBeamWrapper, { transform: [{ rotate: spin }] }]}><View style={styles.radarBeam} /></Animated.View>
            <View style={styles.radarRing1} /><View style={styles.radarRing2} /><View style={styles.axisH} /><View style={styles.axisV} />
          </View>
          <View style={styles.crosshairTopLeft} /><View style={styles.crosshairTopRight} /><View style={styles.crosshairBottomLeft} /><View style={styles.crosshairBottomRight} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020202', alignItems: 'center', paddingTop: 50 },
  header: { fontSize: 22, fontWeight: '900', color: THEME_BLUE_LIGHT, textAlign: 'center', letterSpacing: 4, textShadowColor: THEME_BLUE_LIGHT, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  webFallbackBox: { zIndex: 10, marginTop: 40, padding: 25, backgroundColor: 'rgba(255, 0, 60, 0.05)', borderWidth: 1, borderColor: THEME_ALERT_RED, borderRadius: 10, width: '85%', alignItems: 'center' },
  webFallbackTitle: { color: THEME_ALERT_RED, fontSize: 20, fontWeight: '900', marginBottom: 15, letterSpacing: 2 },
  webFallbackText: { color: '#aaa', fontSize: 13, textAlign: 'center', marginBottom: 5, lineHeight: 20, fontFamily: 'monospace' },
  radarWrapper: { flex: 1, width: '100%', position: 'relative', marginTop: 40, alignItems: 'center' },
  radarOverlay: { position: 'absolute', width: 340, height: 340, justifyContent: 'center', alignItems: 'center' },
  radarContainer: { width: 280, height: 280, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', borderRadius: 140 },
  pulseCircle: { position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: THEME_BLUE_DARK, borderWidth: 2, borderColor: THEME_BLUE_LIGHT },
  radarBeamWrapper: { position: 'absolute', width: 280, height: 280, borderRadius: 140, justifyContent: 'center', alignItems: 'center' },
  radarBeam: { position: 'absolute', top: 0, right: '50%', width: 140, height: 140, borderRightWidth: 2, borderColor: THEME_BLUE_LIGHT, backgroundColor: 'rgba(0, 170, 255, 0.15)' },
  radarRing1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(0, 170, 255, 0.5)', borderStyle: 'dashed' },
  radarRing2: { position: 'absolute', width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(0, 170, 255, 0.3)' },
  axisH: { position: 'absolute', width: '100%', height: 1, backgroundColor: 'rgba(0, 170, 255, 0.4)' },
  axisV: { position: 'absolute', width: 1, height: '100%', backgroundColor: 'rgba(0, 170, 255, 0.4)' },
  crosshairTopLeft: { position: 'absolute', top: 0, left: 0, width: 30, height: 30, borderTopWidth: 3, borderLeftWidth: 3, borderColor: THEME_BLUE_DARK },
  crosshairTopRight: { position: 'absolute', top: 0, right: 0, width: 30, height: 30, borderTopWidth: 3, borderRightWidth: 3, borderColor: THEME_BLUE_DARK },
  crosshairBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 30, height: 30, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: THEME_BLUE_DARK },
  crosshairBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderBottomWidth: 3, borderRightWidth: 3, borderColor: THEME_BLUE_DARK },
});