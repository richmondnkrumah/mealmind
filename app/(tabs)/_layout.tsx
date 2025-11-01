import { PRIMARY } from "@/constants/colors";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/utils/authStore";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { Tabs, router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


// --- Icon components remain the same ---
const PlanIcon = () => <Ionicons name="home-outline" size={24} color="gray" />;
const ListIcon = () => <Ionicons name="list-outline" size={24} color="gray" />;
const GenerateIcon = () => <Ionicons name="add" size={32} color={PRIMARY} />;
const PantryIcon = () => <Ionicons name="cube-outline" size={24} color="gray" />;
const SettingsIcon = () => <Ionicons name="settings-outline" size={24} color="gray" />;

const TabsLayout = () => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [processingState, setProcessingState] = useState<'idle' | 'uploading' | 'extracting'>('idle');
  const { session, fetchProfile } = useAuthStore();

  const waitForExtraction = (uri: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {

      // 1. Set up the Realtime listener BEFORE uploading.
      const topic = `topic:inventory_changes`;
      const channel = supabase.channel(topic, { config: { private: true } });

      const timeout = setTimeout(() => {
        supabase.removeChannel(channel);
        reject(new Error("Processing timed out. Please try again."));
      }, 30000); // 30-second timeout for the whole process

      channel
        .on('broadcast', { event: 'UPDATE' }, () => {
          console.log("Realtime UPDATE received! Extraction is complete.");
          clearTimeout(timeout);
          supabase.removeChannel(channel);
          resolve(); // Resolve the promise, signaling success.
        })
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR') {
            clearTimeout(timeout);
            supabase.removeChannel(channel);
            reject(new Error("Could not connect to the realtime service."));
          }
        });

      // 2. perform the upload.
      try {
        setProcessingState('uploading');
        const fileExt = uri.split(".").pop();
        const fileName = `${session?.user.id}/${Date.now()}.${fileExt}`;
        const filePath = `inventories/${fileName}`;
        const formData = new FormData();
        formData.append("file", { uri, name: fileName, type: `image/${fileExt}` } as any);

        const { error: uploadError } = await supabase.storage
          .from("inventories")
          .upload(filePath, formData);

        if (uploadError) {
          throw uploadError; // This will be caught by the outer catch block
        }
        
        // upload is successful,change the loading message and wait.
        setProcessingState('extracting');

      } catch (error) {
        clearTimeout(timeout);
        supabase.removeChannel(channel);
        reject(error); // Reject the promise if upload fails.
      }
    });
  };

  const handleImageSelection = async (pickerResult: ImagePicker.ImagePickerResult) => {
    if (pickerResult.canceled) return;
    
    try {
      await waitForExtraction(pickerResult.assets[0].uri);

      // runs AFTER the promise has resolved
      await fetchProfile();
      router.push("/(tabs)/pantry");

    } catch (error: any) {
      console.error("Error in processing workflow:", error);
      Alert.alert("Processing Failed", error.message);
    } finally {
      //reset the state
      setProcessingState('idle');
    }
  };

  const handleOpenCamera = async () => {
    setIsOverlayVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera access is required.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    await handleImageSelection(result);
  };

  const handleOpenImagePicker = async () => {
    setIsOverlayVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Media library access is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    await handleImageSelection(result);
  };

  // Determine the loading message based on the current state
  const loadingMessage = processingState === 'uploading' 
    ? 'Uploading...' 
    : 'Extracting Ingredients...';

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "PRIMARY",
          headerShown: false,
        }}
      >
        <Tabs.Screen name="plan" options={{ title: "Plan", tabBarIcon: PlanIcon }} />
        <Tabs.Screen name="list" options={{ title: "List", tabBarIcon: ListIcon }} />
        <Tabs.Screen
          name="generate"
          options={{ title: "", tabBarIcon: GenerateIcon }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setIsOverlayVisible(true);
            },
          }}
        />
        <Tabs.Screen name="pantry" options={{ title: "Pantry", tabBarIcon: PantryIcon }} />
        <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: SettingsIcon }} />
      </Tabs>

      {/* --- Action Overlay Modal --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isOverlayVisible}
        onRequestClose={() => setIsOverlayVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIsOverlayVisible(false)}>
          <BlurView intensity={10} tint="light" style={StyleSheet.absoluteFill} />
        </Pressable>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenCamera}>
            <Ionicons name="camera-outline" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenImagePicker}>
            <Ionicons name="image-outline" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* --- Global Processing Indicator --- */}
      <Modal animationType="fade" transparent={true} visible={processingState !== 'idle'}>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>{loadingMessage}</Text>
        </View>
      </Modal>
    </>
  );
};

// --- Styles remain the same ---
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 90,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: PRIMARY,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default TabsLayout;

// import React from "react";
// import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
// const _layout = () => {
//   return <NativeTabs>
//     <NativeTabs.Trigger name="plan">
//       <Label selectedStyle={{
//         color: 'PRIMARY'
//       }}>Plan</Label>
//       <Icon selectedColor={'PRIMARY'} src={require("../../assets/images/plan.svg")} />
//     </NativeTabs.Trigger>
//     <NativeTabs.Trigger name="list">
//       <Label selectedStyle={{
//         color: 'PRIMARY'
//       }}>List</Label>
//       <Icon selectedColor={'PRIMARY'} src={require("../../assets/images/list-1.svg")} />
//     </NativeTabs.Trigger>
//     <NativeTabs.Trigger name="generate">
//       <Label selectedStyle={{
//         color: 'PRIMARY'
//       }}>Generate</Label>
//       <Icon selectedColor={'PRIMARY'} src={require("../../assets/images/generate.svg")} />
//     </NativeTabs.Trigger>
//     <NativeTabs.Trigger name="pantry">
//       <Label selectedStyle={{
//         color: 'PRIMARY'
//       }}>Pantry</Label>
//       <Icon selectedColor={'PRIMARY'} src={require("../../assets/images/pantry.svg")} />
//     </NativeTabs.Trigger>
//     <NativeTabs.Trigger name="settings">
//       <Label selectedStyle={{
//         color: 'PRIMARY'
//       }} >Settings</Label>
//       <Icon selectedColor={'PRIMARY'} src={require("../../assets/images/settings.svg")} />
//     </NativeTabs.Trigger>
//   </NativeTabs>;
// };

// export default _layout;
