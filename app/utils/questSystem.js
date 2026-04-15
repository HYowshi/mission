// utils/questSystem.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { QUEST_TEMPLATES } from './questTemplates';

// Cấu hình cách thông báo hiển thị khi Ký chủ đang mở app
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// --- HÀM HỖ TRỢ LẤY NGÀY ĐỊA PHƯƠNG (Tránh lỗi UTC) ---
const getLocalDateString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// --- HÀM HỖ TRỢ THÔNG BÁO CHO WEB (PWA) ---
const sendWebNotification = (title, body) => {
  if (Platform.OS === 'web' && "Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: '/favicon.png' });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") new Notification(title, { body, icon: '/favicon.png' });
      });
    }
  }
};

// ==========================================
// 1. HÀM KHỞI TẠO BỘ LỆNH HÀNG NGÀY
// ==========================================
export const initializeDailyQuests = async () => {
  try {
    // 1. Yêu cầu quyền Thông báo
    if (Platform.OS !== 'web') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') console.log("[CẢNH BÁO] Hệ thống bị từ chối quyền truy cập Không gian Thông báo!");
    } else {
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    const todayStr = getLocalDateString();
    
    // 2. Tải Dữ liệu Ký chủ (Profile)
    const profileStr = await AsyncStorage.getItem('@system_user');
    let profile = profileStr ? JSON.parse(profileStr) : { 
      questStreak: 1, 
      gender: "Nam" 
    };
    
    // 3. Tải Dữ liệu Lệnh hiện tại
    const storedData = await AsyncStorage.getItem('@daily_quests');
    let dailyData = storedData ? JSON.parse(storedData) : null;

    let currentStreak = profile.questStreak || 1;
    let autoRegulationFactor = 1.0; 
    
    // 4. KIỂM TRA CHUỖI & ĐIỀU CHỈNH ĐỘ KHÓ (AUTO-REGULATION)
    if (dailyData && dailyData.date !== todayStr) {
      const lastDate = new Date(dailyData.date);
      const todayDate = new Date(todayStr);
      const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        const completedAny = dailyData.quests.some(q => q.isCompleted);
        const failedAny = dailyData.quests.some(q => !q.isCompleted);
        
        if (completedAny && !failedAny) {
          currentStreak += 1; 
        } else {
          currentStreak = Math.max(1, currentStreak - 1);
          if (failedAny) autoRegulationFactor = 0.85; 
        }
      } else if (diffDays > 1) {
        currentStreak = Math.max(1, currentStreak - diffDays);
        autoRegulationFactor = 0.80; 
      }
      
      profile.questStreak = currentStreak;
      await AsyncStorage.setItem('@system_user', JSON.stringify(profile));
    }

    // 5. TẠO LỆNH MỚI NẾU SANG NGÀY MỚI
    if (!dailyData || dailyData.date !== todayStr) {
      if (Platform.OS !== 'web') {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }

      const gender = (profile.gender || "nam").toLowerCase();
      const isFemale = gender.includes('nữ');
      const difficultyTier = Math.floor((currentStreak - 1) / 3);
      const isDeloadDay = currentStreak % 7 === 0; 
      
      let availableTemplates = QUEST_TEMPLATES.filter(q => q.minStreak <= currentStreak);
      if (isDeloadDay) {
        availableTemplates = availableTemplates.filter(q => !q.isExplosive);
      }

      const shuffled = [...availableTemplates].sort(() => 0.5 - Math.random());
      
      let generatedQuests = [];
      let currentTotalLoad = 0;
      const maxDailyLoad = 40 + (currentStreak * 3); 
      let usedStatKeys = new Set(); 

      for (let template of shuffled) {
        if (generatedQuests.length >= 5) break;
        if (usedStatKeys.has(template.statKey)) continue;

        let finalTitle = template.title;
        let finalDesc = template.desc || '';
        let finalReward = template.reward;
        let finalSuccessMsg = template.successMsg;
        let finalLoadCost = template.loadFactor || 0;
        let finalValueForUI = 0;

        if (isFemale && template.descF) finalDesc = template.descF;
        else if (!isFemale && template.descM) finalDesc = template.descM;
        
        if (template.type === 'dynamic') {
          const base = isFemale ? template.baseF : template.baseM;
          const step = isFemale ? template.stepF : template.stepM;
          
          let calcVal = base + (difficultyTier * step);
          calcVal = calcVal * autoRegulationFactor;

          const variance = Math.floor(Math.random() * step) - Math.floor(step / 2);
          calcVal = Math.max(base, calcVal + variance);

          if (isDeloadDay) {
            calcVal = Math.max(base, Math.floor(calcVal * 0.6));
            finalDesc = "[CƠ THỂ PHỤC HỒI] " + finalDesc;
          } 
          else {
            const isBreakthrough = Math.random() < 0.15; 
            if (isBreakthrough) {
              calcVal = Math.floor(calcVal * 1.25); 
              finalReward = Number((finalReward * 2).toFixed(2));
              finalTitle = "🔥 [ĐỘT PHÁ] " + finalTitle;
              finalDesc += "\n\n⚠️ Đột Phá Giới Hạn: Vượt ngưỡng an toàn để nhận x2 Phần thưởng.";
            }
          }

          finalValueForUI = Math.floor(calcVal);
          finalDesc = finalDesc.replace(/\{val\}/g, finalValueForUI);
          finalLoadCost = finalValueForUI * (template.loadFactor || 1);
        }

        if (currentTotalLoad + finalLoadCost > maxDailyLoad && generatedQuests.length >= 3) {
          continue; 
        }

        if (template.isPhysical && !isDeloadDay) {
          finalDesc = "⚠️ CẢNH BÁO: Ký chủ bắt buộc khởi động khớp xoay 3 phút trước khi thực hiện để chống chấn thương vật lý.\n\n" + finalDesc;
        }

        currentTotalLoad += finalLoadCost;
        usedStatKeys.add(template.statKey);

        const hour = Math.floor(Math.random() * (18 - 6)) + 6;
        const minute = Math.floor(Math.random() * 60);
        const triggerDate = new Date();
        triggerDate.setHours(hour, minute, 0, 0);

        generatedQuests.push({
          id: Math.random().toString(36).substring(2, 10),
          title: finalTitle,
          description: finalDesc,
          statKey: template.statKey,
          statName: template.statName,
          reward: finalReward,
          successMsg: finalSuccessMsg,
          triggerTime: triggerDate.getTime(),
          isNotified: false,
          isCompleted: false,
          timerUnit: template.timerUnit || null,
          targetValue: finalValueForUI,
          requirePedometer: template.requirePedometer || false
        });
      }

      generatedQuests.sort((a, b) => a.triggerTime - b.triggerTime);

      // 6. CÀI ĐẶT THÔNG BÁO CHO CÁC LỆNH
      for (const q of generatedQuests) {
        if (q.triggerTime > Date.now()) {
          if (Platform.OS !== 'web') {
            await Notifications.scheduleNotificationAsync({
              content: { 
                title: "⚠️ [HỆ THỐNG] LỆNH MỚI", 
                body: `Lệnh: ${q.title} đã được ban hành.` 
              },
              trigger: new Date(q.triggerTime),
            });
          }
        }
      }

      dailyData = { date: todayStr, quests: generatedQuests };
      await AsyncStorage.setItem('@daily_quests', JSON.stringify(dailyData));
    }

    return dailyData;
  } catch (error) {
    console.error("[CRITICAL] Lỗi khởi tạo Hệ thống Nhiệm vụ:", error);
    return null;
  }
};

// ==========================================
// 2. HÀM XỬ LÝ HOÀN THÀNH NHIỆM VỤ CƠ BẢN
// ==========================================
export const completeQuest = async (questId) => {
  try {
    const storedData = await AsyncStorage.getItem('@daily_quests');
    if (!storedData) return { success: false, message: "Không tìm thấy dữ liệu bộ lệnh." };

    let dailyData = JSON.parse(storedData);
    let completedQuestInfo = null;
    
    dailyData.quests = dailyData.quests.map(q => {
      if (q.id === questId) {
        q.isCompleted = true;
        completedQuestInfo = q;
      }
      return q;
    });

    if (completedQuestInfo) {
      // Chỉ lưu trạng thái Lệnh đã hoàn thành, bỏ qua việc cộng kinh nghiệm vào Hồ Sơ
      await AsyncStorage.setItem('@daily_quests', JSON.stringify(dailyData));
      return {
        success: true,
        quest: completedQuestInfo
      };
    }
    
    return { success: false, message: "Không tìm thấy Lệnh." };
  } catch (error) {
    console.error("[CRITICAL] Lỗi đồng bộ dữ liệu hoàn thành:", error);
    return { success: false, error };
  }
};