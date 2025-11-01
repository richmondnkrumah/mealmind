import { FADED_WHITE, PRIMARY } from "@/constants/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
  ExternalPathString,
  Link,
  LinkProps,
  RelativePathString,
} from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Pressable, Text, StyleSheet } from "react-native";

interface SettingsLinkProps {
  href: any;
  iconName: keyof typeof Feather.glyphMap;
  text: string;
  isExternal?: boolean;
  isDestructive?: boolean;
  displayArrow?: boolean;
}
const SettingsLink = ({
  href,
  iconName,
  text,
  isExternal = false,
  isDestructive = false,
  displayArrow = true,
}: SettingsLinkProps) => {
  const handlePress = () => {
    if (isExternal) {
      WebBrowser.openBrowserAsync(href);
    }
  };

  const linkColor = isDestructive ? "red" : "#333";

  return (
    <Link
      href={isExternal ? "" : href}
      onPress={isExternal ? handlePress : undefined}
      asChild
    >
      <Pressable style={styles.linkContainer}>
        <Feather
          name={iconName}
          size={22}
          color={isDestructive ? "red" : PRIMARY}
        />
        <Text style={[styles.linkText, { color: linkColor }]}>{text}</Text>
        {displayArrow && (
          <Ionicons name="chevron-forward" size={22} color={FADED_WHITE} />
        )}
      </Pressable>
    </Link>
  );
};

export default SettingsLink;

const styles = StyleSheet.create({
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
  },
});
