import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';

const UploadScreen = () => {
  const [videoUri, setVideoUri] = useState(null);
  const navigation = useNavigation();

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true,
      });

      if (result?.assets && result.assets[0]?.uri) {
        setVideoUri(result.assets[0].uri);
      } else if (result.canceled) {
        console.log("User canceled picker");
      }
    } catch (err) {
      console.error('Error picking video:', err);
      Alert.alert("Error", "Could not pick video.");
    }
  };

  const goToPlayer = () => {
    if (!videoUri) {
      Alert.alert("No video", "Please select a video first.");
      return;
    }

    navigation.navigate('Player', { videoUri });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select a Video to Play</Text>
      
      <TouchableOpacity onPress={pickVideo} style={styles.button}>
        <Text style={styles.buttonText}> Choose Video</Text>
      </TouchableOpacity>

      {videoUri && (
        <Text style={styles.preview}>Selected: {videoUri.split('/').pop()}</Text>
      )}

      <TouchableOpacity
        onPress={goToPlayer}
        style={[styles.button, { backgroundColor: videoUri ? '#28a745' : '#888' }]}
        disabled={!videoUri}
      >
        <Text style={styles.buttonText}>▶Play Video</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  preview: {
    color: '#ccc',
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
});
