
import { ImageSourcePropType } from 'react-native';

export const specificIngredientImages: { [key: string]: ImageSourcePropType } = {
    'calories': require('../assets/nutrition/calories.png'),
}
export const getAssetForNutrition = (nutritionName: string): ImageSourcePropType => {
  const key = nutritionName.toLowerCase();
  
  if (specificIngredientImages[key]) {
    return specificIngredientImages[key];
  }
  
  return specificIngredientImages['default'];
};