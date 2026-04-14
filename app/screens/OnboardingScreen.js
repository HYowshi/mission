// screens/OnboardingScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { systemDialogues } from '../utils/systemLogic';

export default function OnboardingScreen() {
  const [step, setStep] = useState(0); // 0: Tên, 1: Giới tính, 2: Ngày sinh, 3: Hoàn thành
  const [fusionPercent, setFusionPercent] = useState(0);
  const [currentDialogue, setCurrentDialogue] = useState("");
  const [userInput, setUserInput] = useState("");
  
  // Lưu trữ dữ liệu người dùng
  const [userData, setUserData] = useState({ name: '', gender: '', dob: '' });

  // Khi bước thay đổi, hệ thống sẽ chọn ngẫu nhiên một câu nói
  useEffect(() => {
    if (step === 0) {
      setCurrentDialogue("Xin chào ký chủ, tôi là hệ thống #ID1. Đang tiến hành dung hợp... \n" + getRandomDialogue('name'));
    } else if (step === 1) {
      setCurrentDialogue(getRandomDialogue('gender'));
    } else if (step === 2) {
      setCurrentDialogue(getRandomDialogue('dob'));
    } else if (step === 3) {
      setCurrentDialogue("Dung hợp 100%. Hoàn tất thu thập dữ liệu. Đang tạo Hồ Sơ Cá Thể...");
      // Chuyển sang màn hình Hồ sơ (B2) tại đây
    }
  }, [step]);

  const getRandomDialogue = (type) => {
    const dialogues = systemDialogues[type];
    const randomIndex = Math.floor(Math.random() * dialogues.length);
    return dialogues[randomIndex];
  };

  const handleNextStep = () => {
    // Lưu dữ liệu và tăng % dung hợp
    if (step === 0) setUserData({ ...userData, name: userInput });
    if (step === 1) setUserData({ ...userData, gender: userInput });
    if (step === 2) setUserData({ ...userData, dob: userInput });

    setUserInput(""); // Xóa khung nhập
    setFusionPercent((prev) => prev + 33); // Tăng khoảng 33% mỗi câu
    setStep(step + 1);
  };

  return (
    <View style={styles.container}>
      {/* Mô phỏng Quả bóng hệ thống */}
      <View style={styles.systemBall}>
         <Text style={styles.eyes}>O  O</Text>
      </View>

      <Text style={styles.dialogueText}>{currentDialogue}</Text>
      
      <Text style={styles.percentText}>Tiến trình dung hợp: {Math.min(fusionPercent, 100)}%</Text>

      {step < 3 && (
        <View style={styles.inputArea}>
          <TextInput 
            style={styles.input} 
            value={userInput} 
            onChangeText={setUserInput}
            placeholder="Nhập câu trả lời..."
          />
          <Button title="Gửi" onPress={handleNextStep} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#1a1a1a' },
  systemBall: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#00d2ff', justifyContent: 'center', alignItems: 'center', marginBottom: 30, shadowColor: '#00d2ff', shadowOpacity: 0.8, shadowRadius: 20 },
  eyes: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  dialogueText: { color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 20, fontStyle: 'italic' },
  percentText: { color: '#00ff00', fontSize: 16, marginBottom: 20, fontWeight: 'bold' },
  inputArea: { width: '100%', flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 5, marginRight: 10 }
});