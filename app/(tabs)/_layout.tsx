import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import {
  Modal,
  View,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons'; // A great icon library
import * as ImagePicker from 'expo-image-picker';

// Define your tab icon components once to keep the layout clean
const PlanIcon = () => <Ionicons name="home-outline" size={24} color="gray" />;
const ListIcon = () => <Ionicons name="list-outline" size={24} color="gray" />;
const GenerateIcon = () => <Ionicons name="add-circle" size={32} color="#CD7926" />; // Make it stand out
const PantryIcon = () => <Ionicons name="cube-outline" size={24} color="gray" />;
const SettingsIcon = () => <Ionicons name="settings-outline" size={24} color="gray" />;


const TabsLayout = () => {
  // State to control the visibility of our action overlay
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  // --- Handlers for the Overlay Buttons ---

  const handleOpenCamera = async () => {
    setIsOverlayVisible(false); // Close the overlay first
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is required.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!result.canceled) {
      // TODO: Start the upload process with result.assets[0].uri
      Alert.alert('Success', 'Image captured! Ready for upload.');
    }
  };

  const handleOpenImagePicker = async () => {
    setIsOverlayVisible(false); // Close the overlay first
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Media library access is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (!result.canceled) {
      // TODO: Start the upload process with result.assets[0].uri
      Alert.alert('Success', 'Image selected! Ready for upload.');
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#CD7926',
          headerShown: false, // Assuming you have headers in child screens
        }}
      >
        <Tabs.Screen name="plan" options={{ title: 'Plan', tabBarIcon: PlanIcon }} />
        <Tabs.Screen name="list" options={{ title: 'List', tabBarIcon: ListIcon }} />
        
        {/* --- The Magic is Here --- */}
        <Tabs.Screen
          name="generate"
          options={{ title: 'Generate', tabBarIcon: GenerateIcon }}
          listeners={{
            tabPress: (e) => {
              // Prevent the default navigation behavior
              e.preventDefault();
              // Show our custom overlay instead
              setIsOverlayVisible(true);
            },
          }}
        />
        
        <Tabs.Screen name="pantry" options={{ title: 'Pantry', tabBarIcon: PantryIcon }} />
        <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: SettingsIcon }} />
      </Tabs>

      {/* --- The Overlay Modal --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isOverlayVisible}
        onRequestClose={() => setIsOverlayVisible(false)}
      >
        {/* The dismissible background */}
        <Pressable style={styles.overlay} onPress={() => setIsOverlayVisible(false)}>
          <BlurView intensity={10} tint="light" style={StyleSheet.absoluteFill} />
        </Pressable>

        {/* The container for our action buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenCamera}>
            <Ionicons name="camera-outline" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenImagePicker}>
            <Ionicons name="image-outline" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 90, // Position it right above the tab bar
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#CD7926',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // Add some shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default TabsLayout;

// import React from "react";
// import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
// const _layout = () => {
//   return <NativeTabs>
//     <NativeTabs.Trigger name="plan">
//       <Label selectedStyle={{
//         color: '#CD7926'
//       }}>Plan</Label>
//       <Icon selectedColor={'#CD7926'} src={require("../../assets/images/plan.svg")} />
//     </NativeTabs.Trigger>
//     <NativeTabs.Trigger name="list">
//       <Label selectedStyle={{
//         color: '#CD7926'
//       }}>List</Label>
//       <Icon selectedColor={'#CD7926'} src={require("../../assets/images/list-1.svg")} />
//     </NativeTabs.Trigger>
//     <NativeTabs.Trigger name="generate">
//       <Label selectedStyle={{
//         color: '#CD7926'
//       }}>Generate</Label>
//       <Icon selectedColor={'#CD7926'} src={require("../../assets/images/generate.svg")} />
//     </NativeTabs.Trigger>
//     <NativeTabs.Trigger name="pantry">
//       <Label selectedStyle={{
//         color: '#CD7926'
//       }}>Pantry</Label>
//       <Icon selectedColor={'#CD7926'} src={require("../../assets/images/pantry.svg")} />
//     </NativeTabs.Trigger>
//     <NativeTabs.Trigger name="settings">
//       <Label selectedStyle={{
//         color: '#CD7926'
//       }} >Settings</Label>
//       <Icon selectedColor={'#CD7926'} src={require("../../assets/images/settings.svg")} />
//     </NativeTabs.Trigger>
//   </NativeTabs>;
// };

// export default _layout;

