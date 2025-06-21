import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
  Modal,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Video, ResizeMode } from 'expo-av';
import Watermark from '../components/Watermark';
import { useAppContext } from '../context/AppContext';

const PlayerScreen = () => {
  const videoRef = useRef<Video | null>(null);
  const [status, setStatus] = useState<any>({});
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [videoLayout, setVideoLayout] = useState({ width: 0, height: 0 });
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const navigation = useNavigation();
  const route = useRoute<any>();

  const {
    videoUri,
    watermarkEnabled,
    securityEnabled,
    username,
    secureMode,
  } = route.params;

  const { theme, screenshotCount, setScreenshotCount } = useAppContext();
  const isDark = theme === 'dark';

  const colors = {
    background: isDark ? '#111' : '#fff',
    text: isDark ? '#fff' : '#111',
  };



useEffect(() => {
  const subscription = ScreenCapture.addScreenshotListener(() => {
    if (securityEnabled) {
      // Pause video
      videoRef.current?.pauseAsync();
      // Increment screenshot count
      setScreenshotCount((prev) => prev + 1);
    }
  });

  return () => {
    subscription.remove();
  };
}, [securityEnabled]);
 
// Screenshot block & log
  useEffect(() => {
    const manageSecurity = async () => {
      if (securityEnabled) {
        await ScreenCapture.preventScreenCaptureAsync();
        setShowPopup(true);
      } else {
        await ScreenCapture.allowScreenCaptureAsync();
      }
    };

    manageSecurity();
    return () => {
      ScreenCapture.allowScreenCaptureAsync();
    };
  }, [securityEnabled]);

  // Screenshot listener to pause and log
  useEffect(() => {
    const sub = ScreenCapture.addScreenshotListener(() => {
      if (secureMode && securityEnabled) {
        setScreenshotCount((prev) => prev + 1);
        videoRef.current?.pauseAsync();
      }
    });
    return () => sub.remove();
  }, [secureMode, securityEnabled]);

  const togglePlayback = async () => {
    if (status.isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      await videoRef.current?.playAsync();
    }
  };

  const toggleMute = async () => {
    const next = !isMuted;
    setIsMuted(next);
    await videoRef.current?.setIsMutedAsync(next);
  };

  const changeRate = async (rate: number) => {
    if (rate > 2) return;
    setPlaybackRate(rate);
    await videoRef.current?.setRateAsync(rate, true);
  };

  const skip = async (seconds: number) => {
    const pos = status.positionMillis + seconds * 1000;
    await videoRef.current?.setPositionAsync(Math.max(pos, 0));
  };

  const enterFullscreen = async () => {
    const landscape = videoLayout.width > videoLayout.height;
    await ScreenOrientation.lockAsync(
      landscape
        ? ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
        : ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
    await videoRef.current?.presentFullscreenPlayer();
  };

  const formatTime = (millis: number = 0) => {
    const sec = Math.floor(millis / 1000);
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {!isFullscreen && (
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}

      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={videoUri ? { uri: videoUri } : require('../assets/Video/sample3.mp4')}
          style={styles.video}
          resizeMode={isFullscreen ? ResizeMode.COVER : ResizeMode.CONTAIN}
          useNativeControls={false}
          isMuted={isMuted}
          rate={playbackRate}
          shouldPlay={false}
          onPlaybackStatusUpdate={setStatus}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setVideoLayout({ width, height });
          }}
          onFullscreenUpdate={({ fullscreenUpdate }) => {
            if (fullscreenUpdate === 1) setIsFullscreen(true);
            if (fullscreenUpdate === 3) {
              setIsFullscreen(false);
              ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            }
          }}
        />

        {watermarkEnabled && (
          <Watermark
            username={username}
            videoTimeMillis={status.positionMillis}
            isPlaying={status.isPlaying}
            videoLayout={videoLayout}
          />
        )}
      </View>

      {/* Controls */}
      {!isFullscreen && (
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => skip(-10)}>
            <Ionicons name="play-back" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={togglePlayback}>
            <Ionicons name={status.isPlaying ? 'pause' : 'play'} size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => skip(10)}>
            <Ionicons name="play-forward" size={24} color="white" />
          </TouchableOpacity>

          <Slider
            style={styles.slider}
            value={status.positionMillis || 0}
            minimumValue={0}
            maximumValue={status.durationMillis || 1}
            onSlidingComplete={(val) => videoRef.current?.setPositionAsync(val)}
            minimumTrackTintColor="#FFF"
            maximumTrackTintColor="#888"
            thumbTintColor="#FFF"
          />

          <Text style={styles.time}>
            {formatTime(status.positionMillis)} / {formatTime(status.durationMillis)}
          </Text>

          <TouchableOpacity onPress={toggleMute}>
            <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={enterFullscreen}>
            <Ionicons name="expand" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Speed buttons */}
      {!isFullscreen && (
        <View style={styles.speedRow}>
          {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
            <TouchableOpacity key={rate} onPress={() => changeRate(rate)}>
              <Text style={[styles.speedText, playbackRate === rate && styles.activeSpeed]}>
                {rate}x
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Screenshot Popup */}
      <Modal visible={showPopup} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>📵 Attention</Text>
            <Text style={styles.modalSub}>Screenshots and recordings are blocked.</Text>
            <TouchableOpacity
              onPress={() => setShowPopup(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PlayerScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  backBtn: {
    position: 'absolute',
    zIndex: 10,
    top: Platform.OS === 'android' ? 40 : 60,
    left: 16,
  },
  videoContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * (9 / 16),
    backgroundColor: 'black',
  },
  video: { ...StyleSheet.absoluteFillObject },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  slider: { flex: 1, marginHorizontal: 10 },
  time: { color: 'white', fontSize: 12, width: 90 },
  speedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  speedText: {
    color: '#ccc',
    fontSize: 13,
    marginHorizontal: 5,
    padding: 4,
  },
  activeSpeed: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 22,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: { fontSize: 20, fontWeight: 'bold', color: 'red', marginBottom: 10 },
  modalSub: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
  modalButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 5,
  },
  modalButtonText: { color: 'white', fontWeight: 'bold' },
});
