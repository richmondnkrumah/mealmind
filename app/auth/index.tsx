import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SignIn from "@/components/SignIn";
import SignUp from "@/components/SignUp";
import { Image } from "expo-image";
import AuthHeader from "@/components/AuthHeader";

const AuthScreen = () => {
  const [authToggle, setAuthToggle] = React.useState<"signIn" | "signUp">(
    "signIn"
  );

  const handleAuthChangeToggle = (value: "signIn" | "signUp") => {
    setAuthToggle(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.logo}
          contentFit="contain"
        />
        {authToggle === "signIn" && (
          <AuthHeader
            title="Welcome Back"
            subTitle="Experience AI Meal Assistant"
          />
        )}
        {authToggle === "signUp" && (
          <AuthHeader
            title="Create Account"
            subTitle="Join Us for with just a single click, no cost"
          />
        )}
      </View>
      {authToggle === "signIn" && (
        <SignIn authChangeHandler={handleAuthChangeToggle} />
      )}
      {authToggle === "signUp" && (
        <SignUp authChangeHandler={handleAuthChangeToggle} />
      )}
    </SafeAreaView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "90%",
    marginHorizontal: "auto",
    marginTop: 60,
  },
  logoContainer: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 70,
    height: 80,
  },
});
