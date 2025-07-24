import React, { useEffect } from 'react';
import { View, Text, useColorScheme, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_PADDING = 30;
const THUMB_SIZE = 20;

interface Props {
  title: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  unit?: string;
  step?: number;
  thumbColor?: string;
  minTrackColor?: string;
  maxTrackColor?: string;
  textColor?: string;
}

const CustomSlider: React.FC<Props> = ({
  title,
  value,
  min,
  max,
  onChange,
  unit = '',
  step = 1,
  thumbColor = '#4CAF50',
  minTrackColor = '#4CAF50',
  maxTrackColor = '#d3d3d3',
  textColor = '#333',
}) => {
  const sliderPos = useSharedValue(value);
  const isSliding = useSharedValue(false);
  const sliderWidth = SCREEN_WIDTH - SLIDER_PADDING * 4;

  useEffect(() => {
    if (!isSliding.value) {
      sliderPos.value = withSpring(value, {
        damping: 15,
        stiffness: 100,
      });
    }
  }, [value]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isSliding.value = true;
    })
    .onUpdate((e) => {
      const newValue = interpolate(
        e.absoluteX - SLIDER_PADDING,
        [0, sliderWidth],
        [min, max],
        'clamp'
      );
      sliderPos.value = newValue;
      runOnJS(onChange)(Math.round(newValue / step) * step);
    })
    .onEnd(() => {
      isSliding.value = false;
      sliderPos.value = withSpring(
        Math.round(sliderPos.value / step) * step,
        { damping: 15, stiffness: 100 }
      );
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: interpolate(
        sliderPos.value,
        [min, max],
        [0, sliderWidth - THUMB_SIZE]
      )
    }],
    backgroundColor: thumbColor,
  }));

  const trackStyle = useAnimatedStyle(() => ({
    width: interpolate(
      sliderPos.value,
      [min, max],
      [0, sliderWidth]
    ),
    backgroundColor: minTrackColor,
  }));

  return (
    <View className="w-full px-4 my-5 font-semibold">
      <Text className="text-base font-semibold mb-3" style={{ color: textColor }}>
        {title}
      </Text>

      <View className="w-full h-7 justify-center">
        <GestureDetector gesture={panGesture}>
          <View className="h-1.5 w-full rounded-full relative" style={{ backgroundColor: maxTrackColor }}>
            <Animated.View
              style={trackStyle}
              className="absolute h-full rounded-full left-0"
            />
            <Animated.View
              style={thumbStyle}
              className="absolute w-7 h-7 rounded-full z-20 top-[-10px] shadow-md"
            />
          </View>
        </GestureDetector>
      </View>

      <Text className="text-center text-base font-bold mt-2" style={{ color: textColor }}>
        {Math.round(value / step) * step} {unit}
      </Text>
    </View>
  );
};

export default CustomSlider;
