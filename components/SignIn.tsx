import {
  StyleSheet,
  Text,
  View,
  AppState,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import React, { useState } from "react";
import AuthInput from "./AuthInput";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/utils/authStore";
import { PRIMARY } from "@/constants/colors";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

type SignInProps = {
  authChangeHandler: (value: "signIn" | "signUp") => void;
};

const SignIn = ({ authChangeHandler }: SignInProps) => {
  const [hidePassword, setHidePassword] = useState(true);
  const router = useRouter();

  const [email, setEmail] = useState("Johndoe@gmail.com");
  const [password, setPassword] = useState("123456789");
  const { saveUserSession, fetchProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  async function signInWithEmail() {
    try {
      setLoading(true);
      const { error, data } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      saveUserSession(data.session!);
      fetchProfile();
      router.replace("/(tabs)/plan");

      if (error) throw error;
    } catch (error) {
      console.log("Error signing in:", error);
      Alert.alert("Error signing in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <AuthInput
        title=""
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
        title=""
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
            {!hidePassword ? (
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
      <View>
        <Pressable onPress={() => router.push("/auth/forgot")}>
          <Text
            style={{
              textAlign: "right",
              color: PRIMARY,
              fontSize: 13
            }}
          >
            Forgot Password
          </Text>
        </Pressable>
      </View>
      <Pressable
        disabled={loading}
        onPress={() => signInWithEmail()}
        style={[styles.signButton, loading && { backgroundColor: "gray" }]}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <View style={styles.bottomContainer}>
        <View style={styles.bottomTextContainer}>
          <Text>Don't have an account?</Text>
          <Pressable onPress={() => authChangeHandler("signUp")}>
            <Text style={{ color: PRIMARY }}>Sign Up here</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text>or continue with</Text>
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

export default SignIn;

const styles = StyleSheet.create({
  signButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PRIMARY,
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
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    gap: 10
  },
  separator: {
    height: 1,
    backgroundColor: "#F5F5F5",
    flex: 1
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
