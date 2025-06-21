import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Watermark = ({ username, videoTimeMillis, isPlaying, videoLayout }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [lastIndex, setLastIndex] = useState(null);

  const getRoundedTimestamp = (millis) => {
    const totalSec = Math.floor((millis || 0) / 1000);
    const rounded = Math.floor(totalSec / 30) * 30;
    const mins = Math.floor(rounded / 60);
    const secs = rounded % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const roundedTime = useMemo(() => getRoundedTimestamp(videoTimeMillis), [videoTimeMillis]);

  useEffect(() => {
    if (!videoLayout.width || !videoLayout.height) return;

    const watermarkWidth = 120;  
    const watermarkHeight = 20;

    const margin = 10;
    const maxX = videoLayout.width - watermarkWidth - margin;
    const maxY = videoLayout.height - watermarkHeight - margin;

    let x, y, index;
    do {
      x = Math.floor(Math.random() * maxX);
      y = Math.floor(Math.random() * maxY);
      index = x + y;
    } while (index === lastIndex);

    setPosition({ top: y, left: x });
    setLastIndex(index);
  }, [roundedTime, videoLayout]);

  return (
    <View style={[styles.overlay, position]}>
      <Text style={styles.text}>{`${username} - ${roundedTime}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    maxWidth: 160,
    zIndex: 999,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Watermark;
