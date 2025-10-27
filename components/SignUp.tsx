import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Platform,
} from "react-native";
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
  const [username, setUsername] = React.useState("");
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
      options: {
        data: {
          username: username
        },
      },
    });
    saveUserSession(session!);
    router.replace("/(tabs)/plan");
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View>
      <AuthInput
        title="Username"
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        leftIcon={
          <Image
            source={require("../assets/images/email.svg")}
            style={{ width: 25, height: 20 }}
          />
        }
      />
      <AuthInput
        title="Email"
        placeholder="Email Address"
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
        placeholder="Password"
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
        placeholder="Confirm Password"
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
      <Pressable
        disabled={loading}
        onPress={() => signUpWithEmail()}
        style={[styles.signButton, loading && { backgroundColor: "gray" }]}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </Pressable>
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
      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text>Or Continue with</Text>
        <View style={styles.separator} />
      </View>
      <View style={styles.altSignContainer}>
        {Platform.OS === "ios" && (
          <Pressable style={styles.altSignCard}>
            <Image
              contentFit="contain"
              source={require("../assets/images/apple.svg")}
              style={{ width: 30, height: 20, flex: 1 }}
            />
          </Pressable>
        )}
        {Platform.OS === "android" && (
          <Pressable style={styles.altSignCard}>
            <Image
              source={require("../assets/images/google.svg")}
              style={{ width: 30, height: 20, flex: 1 }}
              contentFit="contain"
            />
          </Pressable>
        )}
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
  separatorContainer: {
    marginVertical: 30,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  altSignContainer: {
    flexDirection: "row",
    gap: 10,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  altSignCard: {
    borderRadius: "100%",
    backgroundColor: "#F5F5F5",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
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
