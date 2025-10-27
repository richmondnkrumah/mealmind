import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import AuthInput from "@/components/AuthInput";
import AuthHeader from "@/components/AuthHeader";
const ForgotScreen = () => {
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      <AuthHeader
        title="Forgot Password"
        subTitle="Enter your email address to receive a reset link and regain acess to your account"
      />
      <View>
        <AuthInput
          title=""
          placeholder="Email Address"
          value={email}
          onChangeText={(text) => setEmail(text)}
          leftIcon={
            <Image
              source={require("../../assets/images/email.svg")}
              style={{ width: 25, height: 20 }}
            />
          }
        />
        <View style={styles.signButton}>
          <Text style={styles.buttonText}>Continue</Text>
        </View>
      </View>
    </View>
  );
};

export default ForgotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    gap: 30,
  },
  signButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CD7926",
    padding: 15,
    borderRadius: 60,
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
