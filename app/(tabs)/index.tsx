import {
  Image,
  StyleSheet,
  Button,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Linking,
} from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import axios from "axios"; // Import axios
import { AntDesign } from "@expo/vector-icons";

export default function HomeScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false); // Loader state
  const [detections, setDetections] = useState<any[]>([]); // Store detections
  const [message, setMessage] = useState<string | null>(null); // Message for no detection

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Reduce quality for faster upload
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    setUploading(true); // Show loader
    setDetections([]); // Reset detections
    setMessage(null); // Reset message

    const formData: any = new FormData();
    formData.append("file", {
      uri: uri,
      name: "photo.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await axios.post(
        "https://achrefnouira-alliantech-api.hf.space/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response?.data);
      const { detections } = response.data;

      if (detections.length > 0) {
        setDetections(detections);
        Alert.alert(
          "Success",
          `Detected ${detections.length} object(s)!`,
          [{ text: "OK", onPress: () => console.log("Success alert closed") }],
          { cancelable: true }
        );
      } else {
        setMessage("No objects detected. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert(
        "Upload Failed",
        "An error occurred while uploading the image."
      );
    } finally {
      setUploading(false); // Hide loader
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        image ? (
          <Image source={{ uri: image }} style={styles.reactLogo} />
        ) : (
          <View
            style={{
              height: "100%",
              width: "100%",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("@/assets/images/logo.png")}
              style={{
                width: 200,
                alignSelf: "center",
              }}
              resizeMode="contain"
            />
          </View>
        )
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.infoContainer}>
        <ThemedText type="subtitle">Step 1: Choose an Image</ThemedText>
        <ThemedText>
          Click the button below to select an image from your device's library
          or take a photo.
        </ThemedText>
      </ThemedView>
      {/* Show detections when available */}
      {detections.length > 0 && (
        <>
          {detections.map((detection, index) => (
            <View key={index} style={styles.detectionCard}>
              {/* <ThemedText type="subtitle">{detection.class_name}</ThemedText>
              <ThemedText>
                Confidence: {(detection.confidence * 100).toFixed(2)}%
              </ThemedText> */}

              <View style={styles.card}>
                {/*Title */}
                <ThemedText style={[styles.title, { fontSize: 20 }]}>
                  {detection?.info.name || "No model information."}
                </ThemedText>
                {/* Model */}
                <ThemedText style={styles.title}>Model</ThemedText>
                <ThemedText
                  style={[
                    styles.text,
                    { fontWeight: "bold", color: "#fab113", fontSize: 20 },
                  ]}
                >
                  {detection?.info.model || "No model information."}
                </ThemedText>
                {/* Description */}
                <ThemedText style={styles.title}>Description</ThemedText>
                <ThemedText style={styles.text}>
                  {detection?.info.description || "No description available."}
                </ThemedText>

                <View style={{ flexDirection: "row", gap: 10 }}>
                  {/* Datasheet */}
                  {detection?.info.datasheet && (
                    <Pressable
                      style={styles.link}
                      onPress={() => Linking.openURL(detection?.info.datasheet)}
                    >
                      <ThemedText style={[styles.text, { fontWeight: "bold" }]}>
                        Datasheet
                      </ThemedText>
                      <AntDesign name="pdffile1" size={20} color="white" />
                    </Pressable>
                  )}
                  {/* User Manual */}
                  {detection?.info.userManual && (
                    <Pressable
                      style={styles.link}
                      onPress={() =>
                        Linking.openURL(detection?.info.userManual)
                      }
                    >
                      <ThemedText style={[styles.text, { fontWeight: "bold" }]}>
                        User Manual
                      </ThemedText>
                      <AntDesign name="pdffile1" size={24} color="white" />
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          ))}
          {image && (
            <ThemedView style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
            </ThemedView>
          )}
        </>
      )}

      {/* Show message if no objects detected */}
      {message && (
        <ThemedView style={styles.messageContainer}>
          <ThemedText style={{ color: "#e72e2e", fontWeight: "bold" }}>
            {message}
          </ThemedText>
        </ThemedView>
      )}
      <Pressable
        onPress={pickImage}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          backgroundColor: "#002235",
          padding: 9,
          borderRadius: 3,
        }}
      >
        <ThemedText style={{ color: "white", fontWeight: "bold" }}>
          Pick an Image
        </ThemedText>
        <AntDesign name="picture" size={20} color="white" />
      </Pressable>
      <Pressable
        onPress={takePhoto}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          backgroundColor: "#FF6347",
          padding: 9,
          borderRadius: 3,
        }}
      >
        <ThemedText style={{ color: "white", fontWeight: "bold" }}>
          Take a Photo
        </ThemedText>
        <AntDesign name="camera" size={20} color="white" />
      </Pressable>

      {/* Show loader when uploading */}
      {uploading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="white" />
          <ThemedText>Uploading and Analyzing...</ThemedText>
        </View>
      )}

      <ThemedView style={styles.footerContainer}>
        <ThemedText type="subtitle">Need Help?</ThemedText>
        <ThemedText>
          If you encounter any issues, please contact support or refer to our
          help section.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 20,
  },
  infoContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    padding: 16,
  },
  imagePreviewContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  detectionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  detectionCard: {
    backgroundColor: "#002235",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  messageContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  footerContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  reactLogo: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
    objectFit: "cover",
  },
  card: {},
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,

    lineHeight: 20,
  },
  link: {
    backgroundColor: "#f11919",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    padding: 8,
    marginVertical: 10,
    borderRadius: 5,
  },
});
