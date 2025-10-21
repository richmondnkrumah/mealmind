import { StyleSheet, Text, View, Button, Pressable } from "react-native";
import React from "react";
import AuthInput from "./AuthInput";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { hide } from "expo-splash-screen";

type SignInProps = {
  authChangeHandler: (value: "signIn" | "signUp") => void;
};

const SignIn = ({ authChangeHandler }: SignInProps) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [hidePassword, setHidePassword] = React.useState(true);
  const router = useRouter();

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
            {
              hidePassword ? (
                <Image
              source={require("../assets/images/eye-open.svg")}
              style={{ width: 25, height: 20 }}
            />) : (
              <Image
              source={require("../assets/images/eye-closed.svg")}
              style={{ width: 25, height: 20 }}
            />
            )
            }
          </Pressable>
        }
      />
      <View style={styles.signButton}>
        <Text style={styles.buttonText}>Sign In</Text>
        <Image
          source={require("../assets/images/arrow-right.svg")}
          style={{ width: 30, height: 20 , tintColor: "white"}}
        />
      </View>
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
          <Text>Dont have an account?</Text>
          <Pressable onPress={() => authChangeHandler("signUp")}>
            <Text style={{ color: "blue", textDecorationLine: "underline" }}>
              Sign Up
            </Text>
          </Pressable>
        </View>
        <Pressable onPress={() => router.push("/auth/forgot")}>
          <Text
            style={{
              textAlign: "center",
              color: "blue",
              textDecorationLine: "underline",
            }}
          >
            Forgot Password
          </Text>
        </Pressable>
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
