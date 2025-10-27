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
      <View style={styles.headerContainer}>
        
        {authToggle === "signIn" && (
          <AuthHeader
            title="Log in"
            subTitle="Sign in to your account to experience the best AI Meal Assistant"
          />
        )}
        {authToggle === "signUp" && (
          <AuthHeader
            title="Create Account"
            subTitle="Create a new account to get started and enjoy your personalized meal assistant"
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
    paddingTop: 60,
    backgroundColor:'#fff',
    paddingHorizontal: 25
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
});
