import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { OnboardingData } from "../constants/onboarding";
import LottieView from "lottie-react-native";

type Props = {
  index: number;
  x: SharedValue<number>;
  item: OnboardingData;
};

const RenderItem = ({ index, x, item }: Props) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const lottieAnimationStyle = useAnimatedStyle(() => {
    const translateYAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [200, 0, -200],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY: translateYAnimation }],
    };
  });

  const circleAnimation = useAnimatedStyle(() => {
    const scale = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [1, 4, 4],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale: scale }],
    };
  });

  return (
    <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            {
              width: SCREEN_WIDTH,
              height: SCREEN_WIDTH,
              borderRadius: SCREEN_WIDTH / 2,
              backgroundColor: "#fff",
            },
            circleAnimation,
          ]}
        />
      </View>
      <View
        style={{
          position: "relative",
        }}
      >
        <Animated.View style={lottieAnimationStyle}>
          <LottieView
            source={item.animation}
            style={{
              width: SCREEN_WIDTH * 0.9,
              height: SCREEN_WIDTH * 0.9,
            }}
            autoPlay
            loop
          />
        </Animated.View>
        {item.animation2 && (
          <Animated.View
            style={[
              lottieAnimationStyle,
              {
                position: "absolute",
                top: SCREEN_WIDTH * item.animation2.top,
                right: SCREEN_WIDTH * item.animation2.right,
              },
            ]}
          >
            <LottieView
              source={item.animation2.url}
              style={{
                width: SCREEN_WIDTH * item.animation2.width,
                height: SCREEN_WIDTH * item.animation2.height,
                position: "absolute",
                backgroundColor: "transparent",
              }}
              autoPlay
              loop={item.animation2.loop}
            />
          </Animated.View>
        )}
      </View>

      <View>

        <View style={styles.textContainer}>
          <Text style={styles.smallTitle}>{item.smallTitle}</Text>
          <Text style={styles.bigTitle}>{item.bigTitle}</Text>
        </View>
        <Text style={[styles.itemSubtitle, { color: item.textColor }]}>
          {item.subtitle}
        </Text>
      </View>
    </View>
  );
};

export default RenderItem;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 80,
  },
  itemText: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    marginHorizontal: 20,
  },
  itemSubtitle: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 20,
  },
  circleContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  textContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  smallTitle: {
    fontSize: 20,
    color: "#794716",
    lineHeight: 20,
    fontWeight: "600",
  },
  bigTitle: {
    fontSize: 55,
    fontWeight: "900",
    color: "#CD7926",
    lineHeight: 50,
    textTransform: "capitalize",
    
    
  },
});

