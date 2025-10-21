import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import React from "react";

type AuthInputProps = {
  title: string;
  placeholder: string;
  secureTextEntry?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  value: string;
  onChangeText: (text: string) => void;
};

const AuthInput = ({
  title,
  placeholder,
  secureTextEntry,
  leftIcon,
  rightIcon,
  value,
  onChangeText,
}: AuthInputProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <Pressable style={[styles.container]}>
      <Text style={styles.title}>{title}</Text>
      <Pressable
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[
          styles.innerContainer,
          isFocused && { borderColor: "#CD7926", borderWidth: 2 },
        ]}
      >
        {leftIcon}
        <TextInput
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
        />

        {rightIcon}
      </Pressable>
    </Pressable>
  );
};

export default AuthInput;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderColor: "#000",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    gap: 10,
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#E0E0E0",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    flex: 1,
  },
  rightIcon: {
    marginLeft: "auto",
  },
});
