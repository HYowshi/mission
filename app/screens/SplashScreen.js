import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const glitchAnim = useRef(new Animated.Value(0)).current;

  const systemMessages = [
    "[CRITICAL] Unauthorized access detected...",
    "[INFO] Bypassing firewall tier 1...",
    "[WARN] Kernel injection in progress...",
    "[SYSTEM] Overriding security protocols...",
    "[DANGER] Nano-virus spreading...",
    "01010110 01001001 01010010 01010101 01010011",
    "DECRYPTING SOUL DATA...",
    "ESTABLISHING CONNECTION WITH HOST...",
    "SYSTEM APP INSTALLED SUCCESSFULLY."
  ];

  useEffect(() => {
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched === null) {
        // Lần đầu tiên
        setIsFirstTime(true);
        await AsyncStorage.setItem('hasLaunched', 'true');
        runHeavyInfection();
      } else {
        // Lần thứ n
        setIsFirstTime(false);
        runQuickBoot();
      }
    } catch (error) {
      runQuickBoot();
    }
  };

  // Logic cho lần đầu (5 giây)
  const runHeavyInfection = () => {
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < systemMessages.length) {
        setLogs(prev => [...prev, systemMessages[currentLog]]);
        currentLog++;
      }
    }, 450);

    // Hiệu ứng nháy màn hình (Glitch)
    Animated.loop(
      Animated.sequence([
        Animated.timing(glitchAnim, { toValue: 1, duration: 50, useNativeDriver: true }),
        Animated.timing(glitchAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]),
      { iterations: 10 }
    ).start();

    setTimeout(() => {
      clearInterval(interval);
      router.replace('/(tabs)'); // Chuyển vào màn hình chính
    }, 5000);
  };

  // Logic cho lần sau (1 giây)
  const runQuickBoot = () => {
    setLogs(["[RE-ESTABLISHING CONNECTION...]"]);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      router.replace('/(tabs)');
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glitchOverlay, { opacity: glitchAnim }]} />
      
      <View style={styles.terminal}>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>{log}</Text>
        ))}
      </View>

      <View style={styles.centerLogo}>
        <Text style={styles.logoText}>SYSTEM</Text>
        <View style={styles.scannerLine} />
      </View>

      <Text style={styles.version}>v1.0.4_Infected</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  terminal: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
  },
  logText: {
    color: '#00ff41', // Màu xanh Matrix
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 5,
    textShadowColor: '#00ff41',
    textShadowRadius: 5,
  },
  centerLogo: {
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 10,
    textShadowColor: '#00ffff',
    textShadowRadius: 15,
  },
  scannerLine: {
    width: width * 0.6,
    height: 2,
    backgroundColor: '#00ffff',
    marginTop: 10,
    shadowColor: '#00ffff',
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  glitchOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    zIndex: 10,
  },
  version: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    color: '#333',
    fontFamily: 'monospace',
  }
});

export default SplashScreen;