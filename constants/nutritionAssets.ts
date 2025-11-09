
import { ImageSourcePropType } from 'react-native';

export const specificIngredientImages: { [key: string]: ImageSourcePropType } = {
    'calories': require('../assets/nutrition/fire.svg'),
    'protein': require('../assets/nutrition/chicken.svg'),
    'fat': require('../assets/nutrition/cutmeat.svg'),
    'carbo': require('../assets/nutrition/wheat.svg'),
    'default': require('../assets/nutrition/wheat.svg'),
}
export const getAssetForNutrition = (nutritionName: string): ImageSourcePropType => {
  const key = nutritionName.toLowerCase();
  
  if (specificIngredientImages[key]) {
    return specificIngredientImages[key];
  }
  
  return specificIngredientImages['default'];
};