import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useAppContext } from '../context/AppContext';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen = () => {
  const navigation = useNavigation<NavProp>();

  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [securityEnabled, setSecurityEnabled] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const { theme, setTheme, secureMode, setSecureMode, screenshotCount } = useAppContext();
  const isDark = theme === 'dark';

  const colors = {
    background: isDark ? '#111' : '#fff',
    text: isDark ? '#fff' : '#111',
    input: isDark ? '#222' : '#eee',
  };

  const pickVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
      copyToCacheDirectory: true,
    });

    if (result?.assets && result.assets[0]?.uri) {
      setVideoUri(result.assets[0].uri);
    } else {
      Alert.alert('No video selected');
    }
  };

  const goToPlayer = () => {
    if (!videoUri || !username.trim()) {
      Alert.alert('Missing info', 'Select a video and enter username');
      return;
    }

    navigation.navigate('Player', {
      videoUri,
      watermarkEnabled: secureMode ? true : watermarkEnabled,
      securityEnabled: secureMode ? true : securityEnabled,
      username: username.trim(),
      secureMode,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Video Player</Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
        placeholder="Enter username for watermark"
        placeholderTextColor={isDark ? '#aaa' : '#555'}
        value={username}
        onChangeText={setUsername}
      />

      <TouchableOpacity style={styles.button} onPress={pickVideo}>
        <Text style={styles.buttonText}>📁 Pick a Video</Text>
      </TouchableOpacity>

      {videoUri && (
        <View style={[styles.videoInfo, { backgroundColor: colors.input }]}>
          <Text style={[styles.uri, { color: colors.text }]}>
            🎞 {videoUri.split('/').pop()}
          </Text>
          <TouchableOpacity onPress={() => setVideoUri(null)}>
            <Text style={[styles.removeText, { color: colors.text }]}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={{ color: colors.text, textAlign: 'center', marginTop: 10 }}>
        📸 Screenshots Blocked: {screenshotCount}
      </Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={(val) => setTheme(val ? 'dark' : 'light')}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Secure Mode</Text>
        <Switch
          value={secureMode}
          onValueChange={(value) => {
            setSecureMode(value);
            if (!value) {
              setSecurityEnabled(false);
              setWatermarkEnabled(false);
            }
          }}
          thumbColor="#fff"
        />
      </View>

      <TouchableOpacity
        onPress={() => setAdvancedOpen((prev) => !prev)}
        style={{ marginBottom: 10, alignSelf: 'center', padding: 6 }}
      >
        <Text style={[styles.advancedToggle, { color: '#999' }]}>
          ⚙️ Advanced Settings {advancedOpen ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {advancedOpen && (
        <>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Enable Watermark</Text>
            <Switch
              value={watermarkEnabled}
              onValueChange={setWatermarkEnabled}
              disabled={secureMode}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Block Screenshots</Text>
            <Switch
              value={securityEnabled}
              onValueChange={setSecurityEnabled}
              disabled={secureMode}
              thumbColor="#fff"
            />
          </View>
        </>
      )}

      <TouchableOpacity style={styles.startButton} onPress={goToPlayer}>
        <Text style={styles.startButtonText}>▶ Start Playback</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 40,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  videoInfo: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  uri: { fontSize: 14, flexShrink: 1 },
  removeText: {
    fontSize: 18,
    fontWeight: '500',
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 18,
  },
  label: { fontSize: 16 },
  startButton: {
    backgroundColor: '#0066ff',
    padding: 14,
    borderRadius: 10,
    marginTop:20,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,

  },
  advancedToggle: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 8,
  },
});
