// app/(tabs)/profile/index.tsx

import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import React from "react";
import { useAuthStore } from "@/utils/authStore";
import { Image } from "expo-image";
import { FADED_WHITE, PRIMARY } from "@/constants/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";

const ProfileLink = ({ href, iconName, text }) => (
  <Link href={href} asChild>
    <Pressable style={styles.linkContainer}>
      <Feather name={iconName} size={20} color={PRIMARY} />
      <Text style={styles.linkText}>{text}</Text>
      <Ionicons name="chevron-forward" size={22} color="#ccc" />
    </Pressable>
  </Link>
);

const ProfileHubScreen = () => {
  const { profile, removeUserSession, user, fetchProfile } = useAuthStore();

  const handleSignOut = () => {
    supabase.auth.signOut();
    removeUserSession();
  };

  const handleAvatarChange = async () => {
    // 1. Ask for media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need access to your photos to update your avatar."
      );
      return;
    }

    // 2. Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (result.canceled || !user) {
      return;
    }


    // 3. Upload the image to a different bucket (e.g., 'avatars')
    const imageUri = result.assets[0].uri;
    const fileExt = imageUri.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const base64 = result.assets[0].base64!;
    console.log(base64)
    try {
      const decoded = decode(base64)
    }
    catch {
      Alert.alert("the error is here")
    }

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, decode(base64), {
        upsert: true,
        contentType: `image/${fileExt}`,
      });

    if (uploadError) {
      Alert.alert("Error", "Failed to upload avatar.");
      console.error(uploadError);
      return;
    }

    // 4. Get the public URL and update the user's profile
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    if (updateError) {
      Alert.alert(
        "Error",
        "Failed to update your profile with the new avatar."
      );
    } else {
      await fetchProfile(); // Refresh profile to show the new image
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {profile?.avatar_url ? (
            <Image
              source={{ uri: profile.avatar_url }}
              style={styles.avatarImage}
              contentFit="cover"
            />
          ) : (
            <Text style={styles.avatarInitial}>
              {profile?.username?.charAt(0).toUpperCase()}
            </Text>
          )}
          <Pressable
            style={styles.editAvatarButton}
            onPress={handleAvatarChange}
          >
            <Feather name="edit-3" size={18} color="white" />
          </Pressable>
        </View>
        <Text style={styles.username}>{profile?.username || "User"}</Text>
        <Text style={styles.emailText}>{profile?.email}</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          gap: 10,
        }}
      >
        <ProfileLink
          href="/(tabs)/profile/edit-profile"
          iconName="user"
          text="Edit Profile"
        />
        <View style={styles.sectionSeparator}></View>

        <ProfileLink
          href="/(tabs)/profile/change-password"
          iconName="lock"
          text="Change Password"
        />
        <View style={styles.sectionSeparator}></View>

        <ProfileLink
          href="/(tabs)/profile/meal-preferences"
          iconName="settings"
          text="Meal Preferences"
        />
        <View style={styles.sectionSeparator}></View>

        <ProfileLink
          href="/(tabs)/profile/allergies"
          iconName="alert-triangle"
          text="Allergies & Dislikes"
        />
        <View style={styles.sectionSeparator}></View>

        <Pressable onPress={handleSignOut} style={styles.linkContainer}>
          <Feather name="log-out" size={20} color="red" />
          <Text style={[styles.linkText, { color: "red" }]}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default ProfileHubScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 25,
  },
  header: {
    backgroundColor: "white",
    paddingVertical: 30,
    alignItems: "center",
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: FADED_WHITE,
    width: "100%",
  },
  avatarContainer: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 5,
    backgroundColor: PRIMARY,
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "white",
  },
  avatarImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  avatarInitial: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
  },
  username: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  emailText: {
    marginTop: 4,
    fontSize: 16,
    color: "#666",
  },
  linkGroup: {
    marginTop: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
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
// import {
//   StyleSheet,
//   View,
//   Text,
//   Pressable,
//   ScrollView,
//   TextInput,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import { useAuthStore } from "@/utils/authStore";
// import { Image } from "expo-image";
// import { PRIMARY } from "@/constants/colors"; // Assuming you have this from your project
// import Feather from "@expo/vector-icons/Feather";
// import { supabase } from "@/lib/supabase"; // Assuming this is your Supabase client
// import * as ImagePicker from 'expo-image-picker';

// // A reusable component for preference sections
// const PreferenceSection = ({ title, children }) => (
//   <View style={styles.section}>
//     <Text style={styles.sectionTitle}>{title}</Text>
//     {children}
//   </View>
// );

// const ProfileScreen = () => {
//   const { profile, user, fetchProfile } = useAuthStore();

//   // --- Local state for editing. We initialize it from the global store. ---
//   const [username, setUsername] = useState(profile?.username || "");
//   const [planningStyle, setPlanningStyle] = useState(profile?.preferences?.planning_style || 'weekly');
//   const [dislikes, setDislikes] = useState((profile?.preferences?.dislikes || []).join(', '));

//   // State to track if any changes have been made
//   const [isDirty, setIsDirty] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);

//   // When the profile from the global store changes, update our local state
//   useEffect(() => {
//     if (profile) {
//       setUsername(profile.username || "");
//       setPlanningStyle(profile.preferences?.planning_style || 'weekly');
//       setDislikes((profile.preferences?.dislikes || []).join(', '));
//       setIsDirty(false); // Reset dirty state on profile refresh
//     }
//   }, [profile]);

//   // Function to handle saving all changes to Supabase
//   const handleSaveChanges = async () => {
//     if (!user) return;
//     setIsSaving(true);

//     const preferencesUpdate = {
//       planning_style: planningStyle,
//       // Split the dislikes string into an array, trimming whitespace and removing empty strings
//       dislikes: dislikes.split(',').map(s => s.trim()).filter(Boolean),
//     };

//     const { error } = await supabase
//       .from('profiles')
//       .update({
//         username: username,
//         preferences: preferencesUpdate,
//       })
//       .eq('id', user.id);

//     setIsSaving(false);

//     if (error) {
//       Alert.alert('Error', 'Failed to update profile.');
//       console.error(error);
//     } else {
//       Alert.alert('Success', 'Your profile has been updated!');
//       await fetchProfile(); // Refresh the global state with the new data
//     }
//   };

//   // Placeholder for avatar upload logic
//   const handleAvatarChange = async () => {
//     // 1. Ask for media library permissions
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Denied', 'We need access to your photos to update your avatar.');
//       return;
//     }

//     // 2. Launch image picker
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.5,
//     });

//     if (result.canceled || !user) {
//       return;
//     }

//     // 3. Upload the image to a different bucket (e.g., 'avatars')
//     const imageUri = result.assets[0].uri;
//     const fileExt = imageUri.split('.').pop();
//     const filePath = `${user.id}/avatar.${fileExt}`;

//     const formData = new FormData();
//     formData.append('file', { uri: imageUri, name: `avatar.${fileExt}`, type: `image/${fileExt}` } as any);

//     const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, formData, { upsert: true });

//     if (uploadError) {
//         Alert.alert('Error', 'Failed to upload avatar.');
//         console.error(uploadError);
//         return;
//     }

//     // 4. Get the public URL and update the user's profile
//     const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

//     const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);

//     if (updateError) {
//         Alert.alert('Error', 'Failed to update your profile with the new avatar.');
//     } else {
//         await fetchProfile(); // Refresh profile to show the new image
//     }
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: "white" }}>
//       <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
//         <View style={styles.header}>
//           <View style={styles.avatarContainer}>
//             {profile?.avatar_url ? (
//               <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
//             ) : (
//               <Text style={styles.avatarInitial}>
//                 {username?.charAt(0).toUpperCase()}
//               </Text>
//             )}
//             <Pressable style={styles.editAvatarButton} onPress={handleAvatarChange}>
//               <Feather name="edit-3" size={18} color="white" />
//             </Pressable>
//           </View>
//           <Text style={styles.emailText}>{profile?.email}</Text>
//         </View>

//         <PreferenceSection title="Account Information">
//           <Text style={styles.label}>Username</Text>
//           <TextInput
//             style={styles.input}
//             value={username}
//             onChangeText={(text) => { setUsername(text); setIsDirty(true); }}
//             placeholder="Enter your username"
//           />
//         </PreferenceSection>

//         <PreferenceSection title="Meal Preferences">
//           <Text style={styles.label}>Planning Style</Text>
//           <View style={styles.segmentedControl}>
//             <Pressable
//               style={[styles.segment, planningStyle === 'daily' && styles.segmentActive]}
//               onPress={() => { setPlanningStyle('daily'); setIsDirty(true); }}
//             >
//               <Text style={[styles.segmentText, planningStyle === 'daily' && styles.segmentTextActive]}>Daily</Text>
//             </Pressable>
//             <Pressable
//               style={[styles.segment, planningStyle === 'weekly' && styles.segmentActive]}
//               onPress={() => { setPlanningStyle('weekly'); setIsDirty(true); }}
//             >
//               <Text style={[styles.segmentText, planningStyle === 'weekly' && styles.segmentTextActive]}>Weekly</Text>
//             </Pressable>
//           </View>

//           <Text style={styles.label}>Dislikes / Allergies</Text>
//           <TextInput
//             style={[styles.input, { height: 80 }]}
//             value={dislikes}
//             onChangeText={(text) => { setDislikes(text); setIsDirty(true); }}
//             placeholder="e.g., mushrooms, shellfish, olives"
//             multiline
//           />
//           <Text style={styles.inputHelper}>Separate items with a comma.</Text>
//         </PreferenceSection>

//       </ScrollView>

//       {/* Save button only appears if there are unsaved changes */}
//       {isDirty && (
//         <Pressable style={styles.saveButton} onPress={handleSaveChanges} disabled={isSaving}>
//           {isSaving ? (
//             <ActivityIndicator color="white" />
//           ) : (
//             <Text style={styles.saveButtonText}>Save Changes</Text>
//           )}
//         </Pressable>
//       )}
//     </View>
//   );
// };

// export default ProfileScreen;

// const styles = StyleSheet.create({
//   header: {
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 20,
//     backgroundColor: '#f8f8f8',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   avatarContainer: {
//     height: 100,
//     width: 100,
//     borderRadius: 50,
//     backgroundColor: PRIMARY,
//     justifyContent: "center",
//     alignItems: "center",
//     position: "relative",
//   },
//   avatarImage: {
//     height: 100,
//     width: 100,
//     borderRadius: 50,
//   },
//   avatarInitial: {
//     fontSize: 50,
//     fontWeight: 'bold',
//     color: "white",
//   },
//   editAvatarButton: {
//     position: "absolute",
//     bottom: 0,
//     right: 5,
//     backgroundColor: "#333",
//     height: 30,
//     width: 30,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 15,
//     borderWidth: 2,
//     borderColor: 'white',
//   },
//   emailText: {
//     marginTop: 8,
//     fontSize: 16,
//     color: '#666',
//   },
//   section: {
//     marginTop: 20,
//     paddingHorizontal: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     backgroundColor: '#f9f9f9',
//   },
//   inputHelper: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 4,
//   },
//   segmentedControl: {
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderColor: PRIMARY,
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   segment: {
//     flex: 1,
//     padding: 12,
//     alignItems: 'center',
//   },
//   segmentActive: {
//     backgroundColor: PRIMARY,
//   },
//   segmentText: {
//     color: PRIMARY,
//     fontWeight: '600',
//   },
//   segmentTextActive: {
//     color: 'white',
//   },
//   saveButton: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//     backgroundColor: PRIMARY,
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   saveButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });
