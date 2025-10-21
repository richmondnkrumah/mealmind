import { StyleSheet, Text, View } from "react-native";
import React from "react";

type AuthHeaderProps = {
  title: string;
  subTitle: string;
};

const AuthHeader = ({ title, subTitle }: AuthHeaderProps) => {
  return (
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subTitle}>
        {subTitle}
      </Text>
    </View>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
    textContainer: {
    alignItems: "center"
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 18, 
    color: "#794716",
    fontWeight: "600",
  }
});
