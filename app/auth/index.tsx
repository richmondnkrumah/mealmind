import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SignIn from "@/components/SignIn";
import SignUp from "@/components/SignUp";
import { Image } from "expo-image";

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
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subTitle}>Experience AI meal Assitant for everyone</Text>
        </View>
      </View>
      {authToggle === "signIn" && <SignIn authChangeHandler={handleAuthChangeToggle} />}
      {authToggle === "signUp" && <SignUp authChangeHandler={handleAuthChangeToggle} />}
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
