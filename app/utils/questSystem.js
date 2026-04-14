// utils/questSystem.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { QUEST_TEMPLATES } from './questTemplates';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const initializeDailyQuests = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') console.log("Hệ thống bị từ chối quyền thông báo!");

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    const profileStr = await AsyncStorage.getItem('@system_user');
    if (!profileStr) return null;
    let profile = JSON.parse(profileStr);
    
    const storedData = await AsyncStorage.getItem('@daily_quests');
    let dailyData = storedData ? JSON.parse(storedData) : null;

    let currentStreak = profile.questStreak || 1;
    let autoRegulationFactor = 1.0; 
    
    // TÍNH CHUỖI & AUTO-REGULATION
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

    // TẠO LỆNH MỚI
    if (!dailyData || dailyData.date !== todayStr) {
      await Notifications.cancelAllScheduledNotificationsAsync();

      const gender = profile.gender.toLowerCase();
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

      for (let template of shuffled) {
        if (generatedQuests.length >= 5) break;

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
          finalDesc = "⚠️ CHÚ Ý: Bắt buộc khởi động khớp xoay 3 phút trước khi thực hiện để chống chấn thương.\n\n" + finalDesc;
        }

        currentTotalLoad += finalLoadCost;

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

      for (const q of generatedQuests) {
        if (q.triggerTime > Date.now()) {
          await Notifications.scheduleNotificationAsync({
            content: { title: "⚠️ [HỆ THỐNG] LỆNH MỚI", body: `Lệnh: ${q.title}.` },
            trigger: new Date(q.triggerTime),
          });
        }
      }

      dailyData = { date: todayStr, quests: generatedQuests };
      await AsyncStorage.setItem('@daily_quests', JSON.stringify(dailyData));
    }

    return dailyData;
  } catch (error) {
    console.error("Lỗi khởi tạo hệ thống nhiệm vụ:", error);
    return null;
  }
};