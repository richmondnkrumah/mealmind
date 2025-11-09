import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { getAssetForNutrition } from '@/constants/nutritionAssets';
import { Image } from 'expo-image';

const NutritionCard = ({quantity,label}) => {
    const assetSource = getAssetForNutrition(label);
  return (
    <View>
      <Text>{label}</Text>
      <View>
        <Image source={assetSource} style={{width: 40, height: 40}} />
        <Text>{quantity}</Text>
      </View>
    </View>
  )
}

export default NutritionCard

const styles = StyleSheet.create({
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    }
})