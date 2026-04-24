/**
 * FlowMeter.tsx
 * Horizontal animated bar showing flow state (0–100).
 * Colors: red → yellow → green as flow increases.
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { useStore } from '../store/useStore';

interface Props {
  compact?: boolean;
}

const FlowMeter: React.FC<Props> = ({ compact = false }) => {
  const flowLevel = useStore((s) => s.flowLevel);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(flowLevel / 100, { damping: 18, stiffness: 120 });
  }, [flowLevel]);

  const barStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 0.35, 0.65, 1],
      ['#FF6B6B', '#FF6B6B', '#FFD166', '#06D6A0']
    );
    return {
      width: `${progress.value * 100}%`,
      backgroundColor: color,
    };
  });

  const flowLabel =
    flowLevel < 33 ? 'Low Focus' :
    flowLevel < 66 ? 'Building Flow' :
                     '⚡ Deep Focus';

  const labelColor =
    flowLevel < 33 ? '#FF6B6B' :
    flowLevel < 66 ? '#FFB703' :
                     '#06D6A0';

  return (
    <View style={[styles.container, compact && styles.compact]}>
      {!compact && (
        <View style={styles.header}>
          <Text style={styles.title}>Flow State</Text>
          <Text style={[styles.label, { color: labelColor }]}>{flowLabel}</Text>
        </View>
      )}

      {/* Track */}
      <View style={[styles.track, compact && styles.trackCompact]}>
        <Animated.View style={[styles.fill, barStyle, compact && styles.fillCompact]} />

        {/* Glow overlay */}
        <Animated.View style={[styles.glow, barStyle, compact && styles.fillCompact]} />
      </View>

      {!compact && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>0</Text>
          <Text style={styles.footerValue}>{Math.round(flowLevel)}</Text>
          <Text style={styles.footerText}>100</Text>
        </View>
      )}
    </View>
  );
};

export default FlowMeter;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  compact: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    letterSpacing: 0.3,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  track: {
    height: 10,
    backgroundColor: '#F0F0F5',
    borderRadius: 99,
    overflow: 'hidden',
    position: 'relative',
  },
  trackCompact: {
    height: 6,
  },
  fill: {
    height: '100%',
    borderRadius: 99,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  fillCompact: {
    height: '100%',
  },
  glow: {
    height: '100%',
    borderRadius: 99,
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.3,
    // shadow-like glow effect via elevation
    shadowColor: '#06D6A0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  footerText: {
    fontSize: 11,
    color: '#AEAEB2',
  },
  footerValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#48484A',
  },
});
