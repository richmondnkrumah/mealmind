import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import React from "react";
import { Image } from "expo-image";
import AuthInput from "./AuthInput";
import { router, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/utils/authStore";

type SignUpProps = {
  authChangeHandler: (value: "signIn" | "signUp") => void;
};

const SignUp = ({ authChangeHandler }: SignUpProps) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [hideConfirmPassword, setHideConfirmPassword] = React.useState(true);
  const [hidePassword, setHidePassword] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const { saveUserSession } = useAuthStore();
  async function signUpWithEmail() {
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    saveUserSession(session!);
    router.replace("/(tabs)/plan");
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View>
      <AuthInput
        title="Email"
        placeholder="johndoe@gmail.com"
        value={email}
        onChangeText={(text) => setEmail(text)}
        leftIcon={
          <Image
            source={require("../assets/images/email.svg")}
            style={{ width: 25, height: 20 }}
          />
        }
      />
      <AuthInput
        title="Password"
        placeholder="Enter your password"
        secureTextEntry={hidePassword}
        value={password}
        onChangeText={(text) => setPassword(text)}
        leftIcon={
          <Image
            source={require("../assets/images/lock.svg")}
            style={{ width: 25, height: 20 }}
          />
        }
        rightIcon={
          <Pressable onPress={() => setHidePassword(!hidePassword)}>
            {hidePassword ? (
              <Image
                source={require("../assets/images/eye-open.svg")}
                style={{ width: 25, height: 20 }}
              />
            ) : (
              <Image
                source={require("../assets/images/eye-closed.svg")}
                style={{ width: 25, height: 20 }}
              />
            )}
          </Pressable>
        }
      />
      <AuthInput
        title="Password Confirmation"
        placeholder="Confirm your password"
        secureTextEntry={hideConfirmPassword}
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        leftIcon={
          <Image
            source={require("../assets/images/lock.svg")}
            style={{ width: 25, height: 20 }}
          />
        }
        rightIcon={
          <Pressable
            onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
          >
            {hideConfirmPassword ? (
              <Image
                source={require("../assets/images/eye-open.svg")}
                style={{ width: 25, height: 20 }}
              />
            ) : (
              <Image
                source={require("../assets/images/eye-closed.svg")}
                style={{ width: 25, height: 20 }}
              />
            )}
          </Pressable>
        }
      />
      <Pressable onPress={() => signUpWithEmail()} style={styles.signButton}>
        <Text style={styles.buttonText}>Sign Up</Text>
        <Image
          source={require("../assets/images/arrow-right.svg")}
          style={{ width: 30, height: 20, tintColor: "white" }}
        />
      </Pressable>
      <View style={styles.separator} />
      <View style={styles.altSignContainer}>
        <Pressable style={styles.altSignCard}>
          <Image
            source={require("../assets/images/google.svg")}
            style={{ width: 30, height: 20, flex: 1 }}
            contentFit="contain"
          />
        </Pressable>
        <Pressable style={styles.altSignCard}>
          <Image
            contentFit="contain"
            source={require("../assets/images/apple.svg")}
            style={{ width: 30, height: 20, flex: 1 }}
          />
        </Pressable>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomTextContainer}>
          <Text>Already have an account?</Text>
          <Pressable onPress={() => authChangeHandler("signIn")}>
            <Text style={{ color: "blue", textDecorationLine: "underline" }}>
              Sign in
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
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
  separator: {
    height: 1,
    backgroundColor: "gray",
    marginVertical: 20,
  },
  altSignContainer: {
    flexDirection: "row",
    gap: 10,
    height: 60,
  },
  altSignCard: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
    flex: 1,
  },
  bottomContainer: {
    gap: 10,
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 20,
  },
});
