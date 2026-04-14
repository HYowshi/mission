// components/RadarMap.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const THEME_BLUE_DARK = '#0055ff';
const THEME_BLUE_LIGHT = '#00aaff';
const THEME_ALERT_RED = '#ff003c';

const cyberMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#020202" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#8ec3b9" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1a3646" }] },
  { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{ "color": "#4b6878" }] },
  { "featureType": "landscape.man_made", "elementType": "geometry.stroke", "stylers": [{ "color": "#334e87" }] },
  { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [{ "color": "#02101c" }] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#283d6a" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#304a7d" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#98a5be" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#2c6675" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0e1626" }] }
];

export default function RadarMap() {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Hệ thống bị từ chối quyền truy cập Không gian GPS.');
        return;
      }

      try {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);

        const players = [];
        const ranks = ["Người Mới", "Siêu Phàm", "Kẻ Ngoại Đạo", "Hắc Ám"];
        for(let i = 0; i < 5; i++) {
          players.push({
            id: `host_${i}`,
            lat: loc.coords.latitude + (Math.random() - 0.5) * 0.015,
            lng: loc.coords.longitude + (Math.random() - 0.5) * 0.015,
            rank: ranks[Math.floor(Math.random() * ranks.length)],
            isHostile: Math.random() > 0.7 
          });
        }
        setOtherPlayers(players);
      } catch (e) {
        setErrorMsg('Không thể định vị được tọa độ Ký chủ.');
      }
    })();
  }, []);

  useEffect(() => {
    Animated.loop(Animated.timing(pulseAnim, { toValue: 1, duration: 4000, easing: Easing.out(Easing.ease), useNativeDriver: false })).start();
    Animated.loop(Animated.timing(rotateAnim, { toValue: 1, duration: 6000, easing: Easing.linear, useNativeDriver: false })).start();
  }, []);

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={THEME_BLUE_LIGHT} size="large" />
        <Text style={styles.loadingText}>{errorMsg || "ĐANG QUÉT VỊ TRÍ KHÔNG GIAN..."}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>[ RADAR TOÀN CẦU ]</Text>
      <Text style={styles.subHeader}>Phát hiện các sinh thể Ký chủ lân cận</Text>

      <View style={styles.mapWrapper}>
        <MapView 
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          customMapStyle={cyberMapStyle}
          initialRegion={{ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.03, longitudeDelta: 0.03 }}
          showsUserLocation={false} showsMyLocationButton={false} showsCompass={false}
        >
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }}>
            <View style={styles.selfMarker}><View style={styles.selfMarkerCore} /></View>
          </Marker>

          {otherPlayers.map(player => (
            <Marker key={player.id} coordinate={{ latitude: player.lat, longitude: player.lng }}>
              <View style={[styles.playerMarker, player.isHostile && { backgroundColor: THEME_ALERT_RED, shadowColor: THEME_ALERT_RED, borderColor: '#fff' }]} />
            </Marker>
          ))}
        </MapView>

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
  loadingContainer: { flex: 1, backgroundColor: '#020202', justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { color: THEME_BLUE_LIGHT, marginTop: 15, fontFamily: 'monospace', fontSize: 12, letterSpacing: 2, textAlign: 'center' },
  container: { flex: 1, backgroundColor: '#020202', alignItems: 'center', paddingTop: 50 },
  header: { fontSize: 22, fontWeight: '900', color: THEME_BLUE_LIGHT, textAlign: 'center', letterSpacing: 4, textShadowColor: THEME_BLUE_LIGHT, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  subHeader: { color: '#666', textAlign: 'center', marginTop: 8, marginBottom: 20, fontStyle: 'italic', fontFamily: 'monospace' },
  mapWrapper: { flex: 1, width: '100%', position: 'relative', overflow: 'hidden', borderTopWidth: 2, borderColor: THEME_BLUE_DARK },
  map: { ...StyleSheet.absoluteFillObject },
  selfMarker: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0, 170, 255, 0.4)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: THEME_BLUE_LIGHT },
  selfMarkerCore: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff', shadowColor: '#fff', shadowOpacity: 1, shadowRadius: 10 },
  playerMarker: { width: 12, height: 12, borderRadius: 6, backgroundColor: THEME_BLUE_DARK, shadowColor: THEME_BLUE_DARK, shadowOpacity: 1, shadowRadius: 10, borderWidth: 1, borderColor: THEME_BLUE_LIGHT },
  radarOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  radarContainer: { width: 300, height: 300, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', borderRadius: 150 },
  pulseCircle: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: THEME_BLUE_DARK, borderWidth: 2, borderColor: THEME_BLUE_LIGHT },
  radarBeamWrapper: { position: 'absolute', width: 300, height: 300, borderRadius: 150, justifyContent: 'center', alignItems: 'center' },
  radarBeam: { position: 'absolute', top: 0, right: '50%', width: 150, height: 150, borderRightWidth: 2, borderColor: THEME_BLUE_LIGHT, borderTopRightRadius: 0, backgroundColor: 'rgba(0, 170, 255, 0.15)' },
  radarRing1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(0, 170, 255, 0.5)', borderStyle: 'dashed' },
  radarRing2: { position: 'absolute', width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(0, 170, 255, 0.3)' },
  axisH: { position: 'absolute', width: '100%', height: 1, backgroundColor: 'rgba(0, 170, 255, 0.4)' },
  axisV: { position: 'absolute', width: 1, height: '100%', backgroundColor: 'rgba(0, 170, 255, 0.4)' },
  crosshairTopLeft: { position: 'absolute', top: 20, left: 20, width: 30, height: 30, borderTopWidth: 3, borderLeftWidth: 3, borderColor: THEME_BLUE_DARK },
  crosshairTopRight: { position: 'absolute', top: 20, right: 20, width: 30, height: 30, borderTopWidth: 3, borderRightWidth: 3, borderColor: THEME_BLUE_DARK },
  crosshairBottomLeft: { position: 'absolute', bottom: 20, left: 20, width: 30, height: 30, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: THEME_BLUE_DARK },
  crosshairBottomRight: { position: 'absolute', bottom: 20, right: 20, width: 30, height: 30, borderBottomWidth: 3, borderRightWidth: 3, borderColor: THEME_BLUE_DARK },
});