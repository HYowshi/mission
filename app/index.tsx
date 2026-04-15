import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, SafeAreaView, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

// ==========================================
// THIẾT LẬP MÀU SẮC CHỦ ĐẠO (CYBER BLUE)
// ==========================================
const THEME_BLUE_DARK = '#0055ff';
const THEME_BLUE_LIGHT = '#00aaff';
const THEME_PINK_LIGHT = '#ff00a0';

// ==========================================
// NGÂN HÀNG CÂU HỎI ĐA DẠNG & NGẪU NHIÊN
// ==========================================
const systemDialogues = {
  name: [
    "Xin chào ký chủ, tôi là Hệ Thống #ID1.\nĐang tiến hành dung hợp...\n\nỞ tinh cầu này, tên của ngài là gì?",
    "Thực thể sống được xác nhận.\nBắt đầu chuỗi liên kết linh hồn...\n\nHãy cho tôi biết định danh của ngài tại thế giới này.",
    "Hệ thống #ID1 trực tuyến.\nPhát hiện tần số sóng não mới...\n\nKý chủ, ngài muốn được gọi bằng danh xưng nào?"
  ],
  gender: [
    "Đã ghi nhận định danh.\nCấu trúc sinh học của ngài thuộc dạng nào?",
    "Đang phân tích hình thái vật lý...\nHệ thống cần xác nhận: Ngài mang cấu trúc Nam hay Nữ?",
    "Dữ liệu linh hồn đang đồng bộ...\nXin hãy thiết lập giới tính gốc của sinh thể này."
  ],
  dob: [
    "Quét sinh trắc học hoàn tất.\nNgài đã xuất hiện trên cõi đời này vào ngày tháng năm nào?",
    "Đang trích xuất dòng thời gian...\nĐiểm khởi nguyên của ngài ở chiều không gian này là ngày nào?",
    "Chỉ số tương thích đang tăng.\nĐể hoàn tất, hãy nhập toạ độ thời gian ngài ra đời (DD/MM/YYYY)."
  ],
  complete: [
    "Dung hợp 100%.\nThu thập dữ liệu thành công.\nĐang trích xuất mã gen hệ thống...",
    "Đồng bộ hoàn tất 100%.\nKhóa liên kết linh hồn thành công.\nĐang mở khóa [Hồ Sơ Cá Thể]...",
    "Tương thích 100%.\nHệ Thống đã hoàn toàn dung hợp.\nChào mừng ký chủ đến với kỷ nguyên mới..."
  ]
};

// Hàm lấy câu ngẫu nhiên
const getRandomDialogue = (type: keyof typeof systemDialogues) => {
  const list = systemDialogues[type];
  return list[Math.floor(Math.random() * list.length)];
};

// Sinh chỉ số ngẫu nhiên 5-10
const generateStat = () => (Math.random() * (10 - 5) + 5).toFixed(1);

// Thuật toán màu sắc dựa trên dữ liệu người dùng
const calculateThemeColor = (systemId: number, name: string, dob: string, gender: string) => {
  const nameLength = name.replace(/\s/g, '').length;
  const dobSum = dob.match(/\d/g)?.reduce((a, b) => parseInt(a.toString()) + parseInt(b), 0) || 0;
  const genderValue = gender.toLowerCase().includes('nam') ? 1 : 0;
  const magicNumber = systemId + nameLength + dobSum + genderValue;
  const hue = (magicNumber * 47) % 360; 
  return `hsl(${hue}, 80%, 60%)`; 
};

export default function OnboardingScreen() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  
  const [step, setStep] = useState(0);
  const [fusionPercent, setFusionPercent] = useState(0);
  
  const [currentDialogueObj, setCurrentDialogueObj] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const [userInput, setUserInput] = useState("");
  const [userData, setUserData] = useState({ name: '', gender: '', dob: '' });

  // Animation cho Thực thể AI
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Khởi động Animation Thực thể
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 12000, easing: Easing.linear, useNativeDriver: true })
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ])
    ).start();
  }, []);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const spinReverse = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  const scale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1.05] });

  // Kiểm tra bộ nhớ
  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@system_user');
        if (storedUser) {
          router.replace('/(tabs)');
        } else {
          setIsChecking(false);
        }
      } catch (e) {
        setIsChecking(false);
      }
    };
    checkExistingUser();
  }, []);

  // Đổi câu thoại ngẫu nhiên khi chuyển bước
  useEffect(() => {
    if (isChecking) return;
    if (step === 0) setCurrentDialogueObj(getRandomDialogue('name'));
    else if (step === 1) setCurrentDialogueObj(getRandomDialogue('gender'));
    else if (step === 2) setCurrentDialogueObj(getRandomDialogue('dob'));
    else if (step === 3) setCurrentDialogueObj(getRandomDialogue('complete'));
  }, [step, isChecking]);

  // Thuật toán gõ chữ chính xác (slice để chống rớt ký tự)
  useEffect(() => {
    if (!currentDialogueObj) return;
    
    setDisplayedText("");
    setIsTyping(true);
    let i = 0;
    
    const typingInterval = setInterval(() => {
      i++;
      setDisplayedText(currentDialogueObj.slice(0, i));
      
      if (i >= currentDialogueObj.length) {
        clearInterval(typingInterval);
        setIsTyping(false);
        if (step === 3) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          saveDataAndEnterSystem();
        }
      }
    }, 40);

    return () => clearInterval(typingInterval);
  }, [currentDialogueObj, step]);

  const saveDataAndEnterSystem = async () => {
    const initialStats = { 
      strength: generateStat(), 
      agility: generateStat(), 
      stamina: generateStat(), 
      intelligence: generateStat(), 
      appearance: generateStat(),
      luck: generateStat() 
    };
    const themeColor = calculateThemeColor(1, userData.name, userData.dob, userData.gender);
    const finalData = { ...userData, stats: initialStats, rank: 'Người Mới', themeColor, questStreak: 1 };

    await AsyncStorage.setItem('@system_user', JSON.stringify(finalData));
    setTimeout(() => router.replace('/(tabs)'), 2500);
  };

  const handleNextStep = () => {
    if (userInput.trim() === "" || isTyping) return;
    
    if (step === 2 && userInput.length < 10) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert("Hệ thống từ chối: Ngày sinh chưa đủ toạ độ DD/MM/YYYY");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Keyboard.dismiss();

    if (step === 0) setUserData({ ...userData, name: userInput });
    if (step === 2) setUserData({ ...userData, dob: userInput });

    setUserInput("");
    setFusionPercent((prev) => prev + 34); 
    setStep(step + 1);
  };

  const handleGenderSelect = (selectedGender: string) => {
    if (isTyping) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setUserData({ ...userData, gender: selectedGender });
    setFusionPercent((prev) => prev + 34);
    setStep(step + 1);
  };

  const handleDateChange = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    let match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
    if (match) {
      let formatted = !match[2] ? match[1] : `${match[1]}/${match[2]}${match[3] ? `/${match[3]}` : ''}`;
      setUserInput(formatted);
    }
  };

  if (isChecking) return <View style={styles.container}><ActivityIndicator color={THEME_BLUE_LIGHT} size="large" /></View>;

  const renderInputArea = () => {
    if (isTyping || step >= 3) return null;

    if (step === 0) {
      return (
        <View style={styles.inputRow}>
          <View style={styles.inputWrapper}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerBottomRight} />
            <TextInput style={styles.input} value={userInput} onChangeText={setUserInput} placeholder="Định danh của ngài..." placeholderTextColor="#444" autoFocus />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleNextStep}>
            <Text style={styles.buttonText}>XÁC NHẬN</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (step === 1) {
      return (
        <View style={styles.genderContainer}>
          {/* NÚT CHỌN NAM (MÀU XANH) */}
          <TouchableOpacity style={styles.genderBox} onPress={() => handleGenderSelect('Nam')}>
            <LinearGradient colors={['rgba(0, 170, 255, 0.2)', 'transparent']} style={styles.genderGradient} />
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerBottomRight} />
            <Text style={styles.genderText}>NAM</Text>
          </TouchableOpacity>
          
          {/* NÚT CHỌN NỮ (MÀU HỒNG NEON) */}
          <TouchableOpacity style={[styles.genderBox, { borderColor: THEME_PINK_LIGHT }]} onPress={() => handleGenderSelect('Nữ')}>
            <LinearGradient colors={['rgba(255, 0, 160, 0.2)', 'transparent']} style={styles.genderGradient} />
            <View style={[styles.cornerTopLeft, { borderColor: THEME_PINK_LIGHT }]} />
            <View style={[styles.cornerBottomRight, { borderColor: THEME_PINK_LIGHT }]} />
            <Text style={[styles.genderText, { color: THEME_PINK_LIGHT }]}>NỮ</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (step === 2) {
      return (
        <View style={styles.inputRow}>
          <View style={styles.inputWrapper}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerBottomRight} />
            <TextInput style={[styles.input, { textAlign: 'center', fontSize: 18, letterSpacing: 2 }]} value={userInput} onChangeText={handleDateChange} keyboardType="numeric" maxLength={10} placeholder="DD/MM/YYYY" placeholderTextColor="#444" autoFocus />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleNextStep}>
            <Text style={styles.buttonText}>ĐỒNG BỘ</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.content}>
          <Animated.View style={[styles.entityContainer, { transform: [{ scale }] }]}>
            <Animated.View style={[styles.ringOuter, { transform: [{ rotate: spin }] }]} />
            <Animated.View style={[styles.ringInner, { transform: [{ rotate: spinReverse }] }]} />
            <LinearGradient colors={[THEME_BLUE_LIGHT, THEME_BLUE_DARK, '#000000']} style={styles.coreOrb}>
               <Text style={styles.alienEyes}>◈   ◈</Text>
            </LinearGradient>
          </Animated.View>
          <Text style={styles.percentText}>[ Tương thích: {Math.min(fusionPercent, 100)}% ]</Text>
          <View style={styles.dialogueBox}>
            <View style={styles.shardTopLeft} />
            <View style={styles.shardBottomRight} />
            <Text style={styles.dialogueText}>{displayedText}</Text>
          </View>
          {renderInputArea()}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#020202' },
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  entityContainer: { width: 140, height: 140, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  ringOuter: { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 2, borderColor: `rgba(0, 170, 255, 0.4)`, borderStyle: 'dashed' },
  ringInner: { position: 'absolute', width: 110, height: 110, borderRadius: 55, borderWidth: 1, borderColor: THEME_BLUE_LIGHT, borderLeftColor: 'transparent', borderRightColor: 'transparent' },
  coreOrb: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', shadowColor: THEME_BLUE_LIGHT, shadowOpacity: 1, shadowRadius: 30, elevation: 20 },
  alienEyes: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: 2, textShadowColor: '#fff', textShadowRadius: 10 },
  percentText: { color: THEME_BLUE_LIGHT, fontSize: 14, marginBottom: 20, fontFamily: 'monospace', letterSpacing: 2 },
  dialogueBox: { width: '100%', minHeight: 120, padding: 20, backgroundColor: 'rgba(0, 85, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(0, 85, 255, 0.3)', position: 'relative', marginBottom: 30 },
  shardTopLeft: { position: 'absolute', top: -5, left: -5, width: 20, height: 20, borderTopWidth: 2, borderLeftWidth: 2, borderColor: THEME_BLUE_LIGHT },
  shardBottomRight: { position: 'absolute', bottom: -5, right: -5, width: 20, height: 20, borderBottomWidth: 2, borderRightWidth: 2, borderColor: THEME_BLUE_LIGHT },
  dialogueText: { color: '#e0e0e0', fontSize: 17, lineHeight: 28, fontStyle: 'italic', textAlign: 'center' },
  inputRow: { width: '100%', flexDirection: 'row', alignItems: 'center' },
  inputWrapper: { flex: 1, marginRight: 10, position: 'relative', backgroundColor: '#0a0a0a', borderWidth: 1, borderColor: 'rgba(0, 170, 255, 0.3)' },
  input: { color: THEME_BLUE_LIGHT, padding: 15, fontSize: 16, fontFamily: 'monospace' },
  button: { backgroundColor: THEME_BLUE_LIGHT, paddingVertical: 15, paddingHorizontal: 15, justifyContent: 'center', borderLeftWidth: 3, borderLeftColor: '#fff' },
  buttonText: { color: '#000', fontWeight: '900', fontSize: 14, letterSpacing: 1 },
  genderContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 },
  genderBox: { flex: 1, marginHorizontal: 10, height: 60, backgroundColor: '#0a0a0a', borderWidth: 1, borderColor: THEME_BLUE_LIGHT, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' },
  genderGradient: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  genderText: { color: THEME_BLUE_LIGHT, fontSize: 18, fontWeight: '900', letterSpacing: 3 },
  cornerTopLeft: { position: 'absolute', top: -1, left: -1, width: 10, height: 10, borderTopWidth: 2, borderLeftWidth: 2, borderColor: THEME_BLUE_LIGHT },
  cornerBottomRight: { position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottomWidth: 2, borderRightWidth: 2, borderColor: THEME_BLUE_LIGHT },
});