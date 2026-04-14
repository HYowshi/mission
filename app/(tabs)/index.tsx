import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Animated, Easing, Platform, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

const THEME_BLUE_DARK = '#0055ff';
const THEME_BLUE_LIGHT = '#00aaff';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasAutoSpoken, setHasAutoSpoken] = useState(false);

  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const spinReverse = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const data = await AsyncStorage.getItem('@system_user');
          if (data) {
            const parsedData = JSON.parse(data);
            setProfile(parsedData);

            if (!hasAutoSpoken) {
              const luckValue = parsedData.stats.luck ? parseFloat(parsedData.stats.luck).toFixed(1) : "5.0";
              // ĐÃ SỬA: Đọc đúng "Báo cáo Hồ sơ" và "Thân phận", Xóa "Hệ thống trực tuyến"
              const speechText = `Báo cáo Hồ sơ. Ký chủ: ${parsedData.name}. Thân phận: ${parsedData.rank}. Sức mạnh: ${parseFloat(parsedData.stats.strength).toFixed(1)}. Nhanh nhẹn: ${parseFloat(parsedData.stats.agility).toFixed(1)}. Sức bền: ${parseFloat(parsedData.stats.stamina).toFixed(1)}. Trí tuệ: ${parseFloat(parsedData.stats.intelligence).toFixed(1)}. May mắn: ${luckValue}. Ngoại hình: ${parseFloat(parsedData.stats.appearance).toFixed(1)}... Báo cáo kết thúc.`;
              
              setIsSpeaking(true);
              Speech.speak(speechText, {
                language: 'vi-VN',
                rate: 0.95,
                pitch: 0.85,
                onDone: () => setIsSpeaking(false),
                onStopped: () => setIsSpeaking(false),
                onError: () => setIsSpeaking(false)
              });
              setHasAutoSpoken(true);
            }
          }
        } catch (error) {
          console.error("Lỗi khi tải hồ sơ:", error);
        }
      };
      
      loadProfile();

      return () => {
        Speech.stop();
        setIsSpeaking(false);
      };
    }, [hasAutoSpoken])
  );

  const triggerVoiceReport = () => {
    if (!profile) return;
    
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsSpeaking(true);

    const luckValue = profile.stats.luck ? parseFloat(profile.stats.luck).toFixed(1) : "5.0";
    // ĐÃ SỬA: Đọc đúng "Báo cáo Hồ sơ" và "Thân phận", Xóa "Hệ thống trực tuyến"
    const speechText = `Báo cáo Hồ sơ. Ký chủ: ${profile.name}. Thân phận: ${profile.rank}. Sức mạnh: ${parseFloat(profile.stats.strength).toFixed(1)}. Nhanh nhẹn: ${parseFloat(profile.stats.agility).toFixed(1)}. Sức bền: ${parseFloat(profile.stats.stamina).toFixed(1)}. Trí tuệ: ${parseFloat(profile.stats.intelligence).toFixed(1)}. May mắn: ${luckValue}. Ngoại hình: ${parseFloat(profile.stats.appearance).toFixed(1)}... Báo cáo kết thúc.`;
    
    Speech.speak(speechText, {
      language: 'vi-VN',
      rate: 0.95,
      pitch: 0.85,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => {
        alert("Lỗi Âm thanh: Điện thoại của ngài thiếu gói ngôn ngữ Tiếng Việt.");
        setIsSpeaking(false);
      }
    });
  };

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={THEME_BLUE_LIGHT} size="large" />
        <Text style={styles.loadingText}>ĐANG TRÍCH XUẤT DỮ LIỆU...</Text>
      </View>
    );
  }

  const renderStatBox = (label: string, value: any) => {
    const displayValue = value !== undefined ? parseFloat(value).toFixed(2) : "5.00";
    return (
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statNumber}>{displayValue}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContent}>
        
        {/* LÕI LINH HỒN KHÔI PHỤC LẠI BẰNG CODE */}
        <View style={styles.headerArea}>
          <View style={styles.coreWrapper}>
            <Animated.View style={[styles.soulCoreOuter, { transform: [{ rotate: spin }] }]} />
            <Animated.View style={[styles.soulCoreInner, { transform: [{ rotate: spinReverse }] }]} />
            <View style={[styles.coreCenter, isSpeaking && { backgroundColor: '#ff003c', shadowColor: '#ff003c' }]} />
          </View>
          <Text style={styles.headerTitle}>[ HỒ SƠ CÁ THỂ ]</Text>
        </View>

        <View style={styles.alienFrame}>
          <View style={styles.shardTopLeft} />
          <View style={styles.shardBottomRight} />
          <View style={styles.floatingLineRight} />
          <View style={styles.floatingBoxLeft} />
          <View style={styles.notchTop} />
          <View style={styles.notchBottom} />

          <View style={styles.infoSection}>
            <View style={styles.row}>
              <Text style={styles.label}>ĐỊNH DANH</Text>
              <Text style={styles.value}>{profile.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>CẤU TRÚC</Text>
              <Text style={styles.value}>{profile.gender}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>KHỞI NGUYÊN</Text>
              <Text style={styles.value}>{profile.dob}</Text>
            </View>
            <View style={styles.rowHighlight}>
              {/* ĐÃ ĐỔI TỪ CẢNH GIỚI SANG THÂN PHẬN */}
              <Text style={[styles.label, { color: '#000' }]}>THÂN PHẬN</Text>
              <Text style={styles.valueHighlight}>{profile.rank}</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statsColumn}>
              {renderStatBox("SỨC MẠNH", profile.stats.strength)}
              {renderStatBox("SỨC BỀN", profile.stats.stamina)}
              {renderStatBox("MAY MẮN", profile.stats.luck)}
            </View>
            <View style={styles.gridDivider} />
            <View style={styles.statsColumn}>
              {renderStatBox("NHANH NHẸN", profile.stats.agility)}
              {renderStatBox("TRÍ TUỆ", profile.stats.intelligence)}
              {renderStatBox("NGOẠI HÌNH", profile.stats.appearance)}
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.voiceButton, isSpeaking && { borderColor: '#ff003c', backgroundColor: 'rgba(255, 0, 60, 0.1)' }]} 
            onPress={triggerVoiceReport}
          >
            <Text style={[styles.voiceButtonText, isSpeaking && { color: '#ff003c' }]}>
              {isSpeaking ? "[ ĐANG BÁO CÁO... NHẤN ĐỂ DỪNG ]" : "[ KÍCH HOẠT BÁO CÁO ÂM THANH ]"}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, backgroundColor: '#020202', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: THEME_BLUE_LIGHT, marginTop: 15, fontFamily: 'monospace', fontSize: 12, letterSpacing: 2 },
  
  container: { flex: 1, backgroundColor: '#020202' },
  
  innerContent: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingBottom: 90, 
  },

  headerArea: { alignItems: 'center', marginBottom: 15 },
  coreWrapper: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  soulCoreOuter: { position: 'absolute', width: 50, height: 50, borderWidth: 2, borderColor: THEME_BLUE_DARK, borderRadius: 8, transform: [{ rotate: '45deg' }] },
  soulCoreInner: { position: 'absolute', width: 30, height: 30, borderWidth: 1, borderColor: THEME_BLUE_LIGHT, borderRadius: 4 },
  coreCenter: { width: 8, height: 8, backgroundColor: THEME_BLUE_LIGHT, borderRadius: 4, shadowColor: THEME_BLUE_LIGHT, shadowOpacity: 1, shadowRadius: 10, elevation: 10 },
  
  headerTitle: { 
    fontSize: 22, fontWeight: '900', letterSpacing: 4, color: THEME_BLUE_LIGHT,
    ...Platform.select({ 
      ios: { shadowColor: THEME_BLUE_LIGHT, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10 }, 
      android: { textShadowColor: THEME_BLUE_LIGHT, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 } 
    }) 
  },

  alienFrame: { 
    width: '100%', backgroundColor: 'rgba(0, 85, 255, 0.03)', padding: 20, position: 'relative', borderWidth: 1, borderColor: 'rgba(0, 85, 255, 0.2)'
  },
  
  shardTopLeft: { position: 'absolute', top: -10, left: -10, width: 30, height: 30, borderTopWidth: 4, borderLeftWidth: 4, borderColor: THEME_BLUE_LIGHT },
  shardBottomRight: { position: 'absolute', bottom: -10, right: -10, width: 30, height: 30, borderBottomWidth: 4, borderRightWidth: 4, borderColor: THEME_BLUE_LIGHT },
  floatingLineRight: { position: 'absolute', top: 30, right: -15, width: 4, height: 80, backgroundColor: THEME_BLUE_DARK },
  floatingBoxLeft: { position: 'absolute', bottom: 30, left: -5, width: 8, height: 8, backgroundColor: THEME_BLUE_LIGHT, transform: [{ rotate: '45deg' }] },
  notchTop: { position: 'absolute', top: -1, left: '35%', width: '30%', height: 4, backgroundColor: THEME_BLUE_DARK },
  notchBottom: { position: 'absolute', bottom: -1, left: '25%', width: '15%', height: 2, backgroundColor: THEME_BLUE_LIGHT },

  infoSection: { marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 85, 255, 0.1)', paddingBottom: 4 },
  label: { color: THEME_BLUE_DARK, fontSize: 12, fontFamily: 'monospace', letterSpacing: 1, fontWeight: 'bold' },
  value: { color: '#fff', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
  
  rowHighlight: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: THEME_BLUE_LIGHT, padding: 8, borderRadius: 2, marginTop: 8 },
  valueHighlight: { color: '#000', fontSize: 15, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2 },

  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch' },
  statsColumn: { flex: 1, justifyContent: 'space-between' },
  gridDivider: { width: 1, backgroundColor: 'rgba(0, 170, 255, 0.2)', marginHorizontal: 10 },
  
  statBox: { 
    backgroundColor: 'rgba(0, 170, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(0, 170, 255, 0.15)', borderRadius: 5, padding: 10, marginBottom: 8, alignItems: 'center', justifyContent: 'center', borderLeftWidth: 3, borderLeftColor: THEME_BLUE_DARK
  },
  statLabel: { color: '#888', fontSize: 10, fontFamily: 'monospace', letterSpacing: 1, marginBottom: 3 },
  statNumber: { color: THEME_BLUE_LIGHT, fontSize: 18, fontWeight: '900', fontFamily: 'monospace' },

  voiceButton: { 
    marginTop: 15, borderWidth: 1, borderColor: THEME_BLUE_DARK, padding: 12, borderRadius: 5, alignItems: 'center', backgroundColor: 'rgba(0, 85, 255, 0.1)' 
  },
  voiceButtonText: { color: THEME_BLUE_LIGHT, fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: 1 }
});