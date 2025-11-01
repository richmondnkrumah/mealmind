import { StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";

const list = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping List</Text>
    </View>
  );
};

export default list;

const styles = StyleSheet.create({
  container: {
    paddingTop: (StatusBar.currentHeight ?? 0) + 15,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#5C493D",
    paddingTop: 20,
    paddingBottom: 10,
  },
});
