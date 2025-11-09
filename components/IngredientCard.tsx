import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { INGREDIENTCARD } from '@/constants/types'

const IngredientCard = ({ingredient, quantity}: INGREDIENTCARD) => {
  return (
    <View>
      <Text>IngredientCard</Text>
        <Text>{quantity}</Text>
    </View>
  )
}

export default IngredientCard

const styles = StyleSheet.create({})