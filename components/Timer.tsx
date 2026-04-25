/**
 * Timer.tsx
 * Circular SVG Pomodoro timer with animated progress ring.
 */
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { formatTime, phaseLabel } from '../utils/timerUtils';
import { TimerPhase } from '../store/useStore';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 260;
const STROKE_WIDTH = 14;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PHASE_COLORS: Record<TimerPhase, [string, string]> = {
  focus:       ['#7B8FF7', '#B5A8FF'],
  short_break: ['#06D6A0', '#4ECDC4'],
  long_break:  ['#FFB703', '#FF6B6B'],
};

interface Props {
  seconds: number;
  totalSeconds: number;
  isRunning: boolean;
  phase: TimerPhase;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const Timer: React.FC<Props> = ({
  seconds, totalSeconds, isRunning, phase, onStart, onPause, onReset,
}) => {
  const progress = useSharedValue(0);
  const [gradStart, gradEnd] = PHASE_COLORS[phase];

  useEffect(() => {
    const target = 1 - seconds / totalSeconds;
    progress.value = withTiming(target, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [seconds, totalSeconds]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  return (
    <View style={styles.container}>
      {/* Phase label */}
      <Text style={styles.phase}>{phaseLabel(phase)}</Text>

      {/* SVG Ring */}
      <View style={styles.svgWrapper}>
        <Svg width={SIZE} height={SIZE}>
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={gradStart} />
              <Stop offset="100%" stopColor={gradEnd} />
            </LinearGradient>
          </Defs>

          {/* Background track */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#F0F0F5"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />

          {/* Animated progress arc */}
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="url(#grad)"
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={animatedProps}
            strokeLinecap="round"
            rotation="-90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>

        {/* Center content */}
        <View style={styles.center}>
          <Text style={[styles.time, { color: gradStart }]}>
            {formatTime(seconds)}
          </Text>
          <Text style={styles.hint}>
            {isRunning ? 'Running...' : 'Ready'}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.btnSecondary} onPress={onReset}>
          <Text style={styles.btnSecondaryIcon}>↺</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnPrimary, { backgroundColor: gradStart }]}
          onPress={isRunning ? onPause : onStart}
        >
          <Text style={styles.btnPrimaryText}>
            {isRunning ? '⏸' : '▶'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  phase: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  svgWrapper: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
  },
  time: {
    fontSize: 58,
    fontWeight: '300',
    letterSpacing: -2,
    lineHeight: 64,
  },
  hint: {
    fontSize: 13,
    color: '#AEAEB2',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 8,
  },
  btnPrimary: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7B8FF7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  btnPrimaryText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  btnSecondary: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSecondaryIcon: {
    fontSize: 20,
    color: '#48484A',
  },
});
