import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { Pedometer } from 'expo-sensors'; 

const THEME_BLUE_DARK = '#0055ff';
const THEME_BLUE_LIGHT = '#00aaff';
const THEME_ALERT_RED = '#ff003c';

export default function QuestScreen() {
  const [activeQuests, setActiveQuests] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [currentStreak, setCurrentStreak] = useState(1);

  // Modal State cho Timer / Pedometer
  const [activeToolQuest, setActiveToolQuest] = useState<any>(null);
  const [timerLeft, setTimerLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const [currentSteps, setCurrentSteps] = useState(0);
  const [pedometerSubscription, setPedometerSubscription] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchSystemData = async () => {
        const profileStr = await AsyncStorage.getItem('@system_user');
        if (profileStr) {
          setCurrentStreak(JSON.parse(profileStr).questStreak || 1);
        }

        const storedData = await AsyncStorage.getItem('@daily_quests');
        if (storedData) {
          const data = JSON.parse(storedData);
          setCurrentTime(Date.now());
          const visibleQuests = data.quests.filter((q: any) => Date.now() >= q.triggerTime);
          setActiveQuests(visibleQuests);
        }
      };
      
      fetchSystemData();
      const interval = setInterval(fetchSystemData, 10000); 
      return () => clearInterval(interval);
    }, [])
  );

  // LOGIC ĐỒNG HỒ ĐẾM NGƯỢC
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timerLeft > 0) {
      interval = setInterval(() => {
        setTimerLeft(prev => prev - 1);
      }, 1000);
    } else if (timerLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("HỆ THỐNG", "Chu kỳ đã hoàn tất! Ký chủ có thể báo cáo.");
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerLeft]);

  // LOGIC ĐẾM BƯỚC CHÂN
  const startPedometer = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    if (isAvailable) {
      const sub = Pedometer.watchStepCount(result => {
        setCurrentSteps(result.steps);
      });
      setPedometerSubscription(sub);
    } else {
      Alert.alert("Lỗi Cảm Biến", "Điện thoại của Ký chủ không hỗ trợ đếm bước chân. Hãy tự ước lượng.");
    }
  };

  const stopPedometer = () => {
    if (pedometerSubscription) {
      pedometerSubscription.remove();
      setPedometerSubscription(null);
    }
  };

  const openActionTool = (quest: any) => {
    setActiveToolQuest(quest);
    if (quest.timerUnit === 'giây') setTimerLeft(quest.targetValue);
    else if (quest.timerUnit === 'phút') setTimerLeft(quest.targetValue * 60);
    else if (quest.timerUnit === 'pomodoro') setTimerLeft(quest.targetValue * 25 * 60);
    else if (quest.requirePedometer) {
      setCurrentSteps(0);
      startPedometer();
    }
  };

  const closeActionTool = () => {
    setIsTimerRunning(false);
    stopPedometer();
    setActiveToolQuest(null);
  };

  const calculateRank = (stats: any) => {
    const totalStats = 
      parseFloat(stats.strength) + parseFloat(stats.agility) + 
      parseFloat(stats.stamina) + parseFloat(stats.intelligence) + 
      parseFloat(stats.appearance) + parseFloat(stats.luck || 5);

    if (totalStats >= 100) return "Siêu Nhân";
    if (totalStats >= 80) return "Siêu Phàm";
    if (totalStats >= 60) return "Siêu Phàm Giả cấp 2";
    if (totalStats >= 45) return "Siêu Phàm Giả cấp 1";
    return "Người Mới";
  };

  const handleComplete = async (quest: any) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      const profileData = await AsyncStorage.getItem('@system_user');
      if (profileData) {
        let profile = JSON.parse(profileData);
        let currentStat = parseFloat(profile.stats[quest.statKey] || 5.0);
        profile.stats[quest.statKey] = (currentStat + quest.reward).toFixed(2);

        const oldRank = profile.rank;
        const newRank = calculateRank(profile.stats);
        profile.rank = newRank;

        await AsyncStorage.setItem('@system_user', JSON.stringify(profile));

        if (oldRank !== newRank) {
          Alert.alert("⚡ THĂNG CẤP THÂN PHẬN ⚡", `Chúc mừng Ký chủ!\nNgài đã thăng cấp thành: [${newRank.toUpperCase()}]\n\n${quest.successMsg}`);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } else {
          Alert.alert(`HẤP THỤ +${quest.reward} ${quest.statName.toUpperCase()}`, quest.successMsg);
        }
      }

      const dailyData = await AsyncStorage.getItem('@daily_quests');
      let data = JSON.parse(dailyData!);
      data.quests = data.quests.map((q: any) => q.id === quest.id ? { ...q, isCompleted: true } : q);
      await AsyncStorage.setItem('@daily_quests', JSON.stringify(data));

      setActiveQuests(data.quests.filter((q: any) => Date.now() >= q.triggerTime));
      closeActionTool();
    } catch (error) {
      console.error(error);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const renderQuestItem = ({ item }: { item: any }) => {
    const isCompleted = item.isCompleted;
    const deadlineDate = new Date();
    deadlineDate.setHours(23, 0, 0, 0);
    const isExpired = currentTime > deadlineDate.getTime();
    const isFailed = !isCompleted && isExpired;
    
    const isBreakthrough = item.title.includes("ĐỘT PHÁ");
    const cardBorderColor = isBreakthrough ? THEME_ALERT_RED : THEME_BLUE_LIGHT;
    const hasTool = item.timerUnit || item.requirePedometer;

    return (
      <View style={[
        styles.questCard, 
        isBreakthrough && { borderColor: 'rgba(255, 0, 60, 0.4)' },
        isCompleted && [styles.questCardCompleted, { borderColor: cardBorderColor }], 
        isFailed && styles.questCardFailed
      ]}>
        <View style={[styles.cornerTopLeft, isBreakthrough && { borderColor: THEME_ALERT_RED }]} />
        <View style={[styles.cornerBottomRight, isBreakthrough && { borderColor: THEME_ALERT_RED }]} />

        <View style={styles.questInfo}>
          <Text style={[styles.questTitle, isBreakthrough && { color: THEME_ALERT_RED }, isCompleted && styles.textCompleted]}>
            [{item.title}]
          </Text>
          <Text style={styles.questDesc}>{item.description}</Text>
          <Text style={[styles.questReward, isBreakthrough && { color: THEME_ALERT_RED }]}>Phần thưởng: +{item.reward} {item.statName}</Text>
          <Text style={styles.timeText}>
            Phát động: {new Date(item.triggerTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.completeButton, 
            isBreakthrough && { backgroundColor: THEME_ALERT_RED, borderLeftColor: '#fff' },
            isCompleted && [styles.completeButtonDone, { borderColor: cardBorderColor }], 
            isFailed && styles.completeButtonFailed
          ]}
          onPress={() => {
            if (hasTool && !isCompleted && !isFailed) openActionTool(item);
            else handleComplete(item);
          }}
          disabled={isCompleted || isFailed}
        >
          <Text style={[
            styles.completeButtonText, 
            isCompleted && { color: cardBorderColor }
          ]}>
            {isFailed ? "THẤT BẠI" : isCompleted ? "ĐÃ XONG" : hasTool ? "THỰC THI LỆNH" : "BÁO CÁO"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>[ BỘ LỆNH KHẢ DỤNG ]</Text>
      
      <View style={styles.streakBox}>
        <Text style={styles.streakText}>CHUỖI TIẾN HÓA: <Text style={styles.streakHighlight}>{currentStreak} NGÀY</Text></Text>
        <Text style={styles.streakSubText}>Duy trì kỷ luật để mở khóa kỹ năng mới. Cẩn thận đột phá!</Text>
      </View>
      
      <Text style={styles.deadlineWarning}>DEADLINE CHUNG: 23:00</Text>
      
      <FlatList
        data={activeQuests}
        keyExtractor={(item) => item.id}
        renderItem={renderQuestItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>Hệ thống đang quét sinh mệnh...\nChưa có bộ lệnh nào được kích hoạt.</Text>}
      />

      {/* MODAL CÔNG CỤ TƯƠNG TÁC */}
      <Modal visible={!!activeToolQuest} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.toolBox}>
            <Text style={styles.toolTitle}>[ HỆ THỐNG ĐỒNG BỘ ]</Text>
            
            {activeToolQuest?.timerUnit && (
              <>
                <Text style={styles.timerText}>{formatTime(timerLeft)}</Text>
                <TouchableOpacity 
                  style={[styles.toolButton, isTimerRunning && { backgroundColor: THEME_ALERT_RED }]} 
                  onPress={() => setIsTimerRunning(!isTimerRunning)}
                >
                  <Text style={styles.toolButtonText}>{isTimerRunning ? "TẠM DỪNG" : "BẮT ĐẦU KÍCH HOẠT"}</Text>
                </TouchableOpacity>
              </>
            )}

            {activeToolQuest?.requirePedometer && (
              <>
                <Text style={styles.timerText}>{currentSteps} / {activeToolQuest.targetValue}</Text>
                <Text style={{ color: '#aaa', marginBottom: 20, textAlign: 'center' }}>Hãy giữ điện thoại bên người và bắt đầu di chuyển.</Text>
              </>
            )}

            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity style={[styles.toolButton, { flex: 1, backgroundColor: '#333', marginRight: 10 }]} onPress={closeActionTool}>
                <Text style={styles.toolButtonText}>HỦY BỎ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toolButton, { flex: 1, backgroundColor: THEME_BLUE_DARK }]} onPress={() => handleComplete(activeToolQuest)}>
                <Text style={styles.toolButtonText}>BÁO CÁO XONG</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020202', padding: 20, paddingTop: 50 },
  header: { fontSize: 22, fontWeight: '900', color: THEME_BLUE_LIGHT, textAlign: 'center', letterSpacing: 3, textShadowColor: THEME_BLUE_LIGHT, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  
  streakBox: { backgroundColor: 'rgba(0, 170, 255, 0.1)', padding: 10, borderRadius: 5, marginTop: 15, alignItems: 'center', borderWidth: 1, borderColor: THEME_BLUE_DARK },
  streakText: { color: '#fff', fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace' },
  streakHighlight: { color: THEME_BLUE_LIGHT, fontSize: 16, fontWeight: '900' },
  streakSubText: { color: '#888', fontSize: 11, fontStyle: 'italic', marginTop: 3 },
  
  deadlineWarning: { color: THEME_ALERT_RED, textAlign: 'center', marginBottom: 20, fontWeight: 'bold', letterSpacing: 2, marginTop: 15 },
  emptyText: { color: '#555', textAlign: 'center', marginTop: 50, fontStyle: 'italic', lineHeight: 26, fontFamily: 'monospace' },
  
  questCard: { backgroundColor: 'rgba(0, 85, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(0, 85, 255, 0.2)', padding: 18, marginBottom: 20, flexDirection: 'row', alignItems: 'center', position: 'relative' },
  questCardCompleted: { backgroundColor: 'rgba(0, 170, 255, 0.05)' },
  questCardFailed: { borderColor: '#333', backgroundColor: '#111', opacity: 0.5 },
  
  cornerTopLeft: { position: 'absolute', top: -1, left: -1, width: 10, height: 10, borderTopWidth: 2, borderLeftWidth: 2, borderColor: THEME_BLUE_LIGHT },
  cornerBottomRight: { position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottomWidth: 2, borderRightWidth: 2, borderColor: THEME_BLUE_LIGHT },

  questInfo: { flex: 1, paddingRight: 10 },
  questTitle: { color: '#fff', fontSize: 16, fontWeight: '900', marginBottom: 8, letterSpacing: 1 },
  questDesc: { color: '#aaa', fontSize: 13, marginBottom: 10, lineHeight: 20 },
  questReward: { color: THEME_BLUE_LIGHT, fontSize: 13, fontWeight: 'bold', fontFamily: 'monospace', marginBottom: 5 },
  timeText: { color: '#555', fontSize: 11, fontStyle: 'italic', fontFamily: 'monospace' },
  textCompleted: { textDecorationLine: 'line-through', opacity: 0.6 },
  
  completeButton: { backgroundColor: THEME_BLUE_DARK, paddingVertical: 15, paddingHorizontal: 15, justifyContent: 'center', borderLeftWidth: 3, borderLeftColor: THEME_BLUE_LIGHT },
  completeButtonDone: { backgroundColor: 'transparent', borderWidth: 1 },
  completeButtonFailed: { backgroundColor: '#222', borderLeftColor: '#555' },
  completeButtonText: { color: '#fff', fontWeight: '900', fontSize: 12, textAlign: 'center', letterSpacing: 1 },

  // MODAL TOOL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  toolBox: { width: '100%', backgroundColor: '#111', borderWidth: 2, borderColor: THEME_BLUE_LIGHT, borderRadius: 10, padding: 30, alignItems: 'center' },
  toolTitle: { color: THEME_BLUE_LIGHT, fontSize: 20, fontWeight: '900', letterSpacing: 2, marginBottom: 20 },
  timerText: { color: '#fff', fontSize: 50, fontWeight: '900', fontFamily: 'monospace', marginBottom: 20 },
  toolButton: { backgroundColor: THEME_BLUE_DARK, paddingVertical: 15, paddingHorizontal: 30, borderRadius: 5, width: '100%', alignItems: 'center' },
  toolButtonText: { color: '#fff', fontWeight: '900', fontSize: 14 }
});