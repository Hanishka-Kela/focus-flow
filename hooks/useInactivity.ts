/**
 * useInactivity.ts
 * Detects user inactivity. Fires a notification and decays flow after 60s idle.
 */
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useStore } from '../store/useStore';

const IDLE_THRESHOLD_MS = 60_000; // 60 seconds

export const useInactivity = () => {
  const { isRunning, recordInteraction, decayFlow, lastInteractionAt } = useStore();
  const notifSentRef = useRef(false);

  // Request notification permissions once
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permission not granted');
      }
    })();
  }, []);

  // Poll every 5 seconds for idle detection
  useEffect(() => {
    if (!isRunning) {
      notifSentRef.current = false;
      return;
    }

    const interval = setInterval(() => {
      const idleMs = Date.now() - lastInteractionAt;

      // Decay flow regardless
      decayFlow();

      // Fire notification once per idle period
      if (idleMs > IDLE_THRESHOLD_MS && !notifSentRef.current) {
        notifSentRef.current = true;
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'Get back to work ⚡',
            body: "You've been idle. Your flow is dropping!",
            sound: true,
          },
          trigger: null, // immediate
        });
      }

      // Reset flag if user became active again
      if (idleMs < IDLE_THRESHOLD_MS) {
        notifSentRef.current = false;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isRunning, lastInteractionAt, decayFlow]);

  return { recordInteraction };
};
