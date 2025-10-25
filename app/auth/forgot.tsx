import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
const ForgotScreen = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subTitle}>
          Input the email assocaited with the account you want to recover
        </Text>
      </View>
      <View style={styles.signButton}>
        <Text style={styles.buttonText}>Sign Up</Text>
        <Image
          source={require("../../assets/images/arrow-right.svg")}
          style={{ width: 30, height: 20, tintColor: "white" }}
        />
      </View>
    </View>
  );
};

export default ForgotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "90%",
    marginHorizontal: "auto",
    marginTop: 60,
  },
  signButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CD7926",
    padding: 18,
    borderRadius: 10,
    marginTop: 20,
    gap: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 18,
    color: "#794716",
    fontWeight: "600",
  },
});
