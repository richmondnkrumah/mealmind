import { AnimationObject } from "lottie-react-native";

export interface OnboardingData {
  id: number;
  animation: AnimationObject;
  smallTitle: string;
  bigTitle: string;
  subtitle: string;
  textColor: string;
  animation2?: {
    url: AnimationObject;
    top: number;
    right: number;
    loop: boolean;
    width: number;
    height: number;
  };
}

const data: OnboardingData[] = [
  {
    id: 1,
    animation: require("../assets/animations/kol.json"),
    smallTitle: "Tired of ",
    bigTitle: "What's for Dinner?",
    subtitle:
      "Meal planning can feel like a daily chore. We get it. Let's make it effortless.",
    textColor: "#794716",
  },
  {
    id: 2,
    animation: require("../assets//animations/gtr.json"),
    animation2: {
      url: require("../assets//animations/vd.json"),
      top: 0.2,
      right: 0.8,
      loop: false,
      width: 0.9,
      height: 0.9
    },

    smallTitle: "Plan Your ",
    bigTitle: "Week in a Snap",
    subtitle:
      "Our AI scans your pantry, finds recipes and builds you a smart list.",
    textColor: "#794716",
  },
  {
    id: 3,
    animation: require("../assets//animations/dee.json"),
    animation2: {
      url: require("../assets//animations/lasto.json"),
      top: 0.5,
      right: 0.78,
      loop: true,
      width: 0.6,
      height: 0.6
    },

    smallTitle: "Eat Well",
    bigTitle: "Waste Less Food",
    subtitle: "Get ready for a week of perfectly planned delicious meals",
    textColor: "#794716",
  },
];

export default data;
