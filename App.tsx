import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

const SIZE = 100.0;
const CIRCLE_RADIUS = SIZE * 2;

type ContextType = {
  translateX: number
  translateY: number
}

export default function App() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, ContextType>({
    onStart: (event, context) => {
      context.translateX = translateX.value
      context.translateY = translateY.value
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      translateY.value = event.translationY + context.translateY;
    },
    onEnd: () => {
      const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2);

      if (distance < CIRCLE_RADIUS + SIZE / 2) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }

    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: translateX.value,
      },
      {
        translateY: translateY.value,
      }]
    }
  })

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <GestureHandlerRootView style={styles.gestureWrapper}>
          <PanGestureHandler onGestureEvent={panGestureEvent}>
            <Animated.View style={[styles.square, rStyle]} />
          </PanGestureHandler>
        </GestureHandlerRootView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gestureWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: 'blue',
    opacity: 0.5,
    borderRadius: 20,
  },
  circle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CIRCLE_RADIUS,
    borderWidth: 5,
    borderColor: 'blue',
    opacity: 0.5
  }
});
