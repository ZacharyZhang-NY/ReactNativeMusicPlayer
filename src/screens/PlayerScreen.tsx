import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Slider } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { RootStackParamList } from '../types';
import { 
  togglePlayback, 
  skipToNext, 
  skipToPrevious, 
  seekTo,
  getCurrentPosition,
  getDuration,
  getIsPlaying,
  getCurrentTrack
} from '../services/SimplePlayerService';

type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;

const PlayerScreen = () => {
  const route = useRoute<PlayerScreenRouteProp>();
  const navigation = useNavigation();
  const { track } = route.params;
  const { styles } = useStyles(stylesheet);
  const [currentTrack, setCurrentTrack] = useState(track);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // 设置定时器更新播放进度
    const interval = setInterval(async () => {
      const position = await getCurrentPosition();
      setCurrentPosition(position);
      
      const dur = await getDuration();
      if (dur > 0) {
        setDuration(dur);
      }
      
      setIsPlaying(getIsPlaying());
      
      const track = getCurrentTrack();
      if (track && track.id !== currentTrack.id) {
        setCurrentTrack(track);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [currentTrack.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async () => {
    await togglePlayback();
  };

  const handleNext = async () => {
    await skipToNext();
  };

  const handlePrevious = async () => {
    await skipToPrevious();
  };

  const handleSeek = async (value: number) => {
    await seekTo(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>❮</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>正在播放</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        {/* 专辑封面 */}
        <View style={styles.albumArt}>
          <Text style={styles.albumArtText}>
            {currentTrack.title.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        {/* 歌曲信息 */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
          <Text style={styles.trackAlbum} numberOfLines={1}>
            {currentTrack.album}
          </Text>
        </View>

        {/* 进度条 */}
        <View style={styles.progressContainer}>
          <Slider
            style={styles.progressBar}
            value={currentPosition}
            minimumValue={0}
            maximumValue={duration}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="#333"
            thumbTintColor="#fff"
            onSlidingComplete={handleSeek}
          />
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{formatTime(currentPosition)}</Text>
            <Text style={styles.time}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* 控制按钮 */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handlePrevious}
          >
            <Text style={styles.controlIcon}>⏮</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.controlButton, styles.playButton]}
            onPress={handlePlayPause}
          >
            <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleNext}
          >
            <Text style={styles.controlIcon}>⏭</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: theme.colors.text,
    fontSize: 24,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: theme.typography.subtitle.fontWeight,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  albumArt: {
    width: 300,
    height: 300,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  albumArtText: {
    color: theme.colors.text,
    fontSize: 120,
    fontWeight: 'bold',
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  trackTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    marginBottom: theme.spacing.sm,
    maxWidth: '90%',
  },
  trackArtist: {
    color: theme.colors.text,
    fontSize: theme.typography.subtitle.fontSize,
    marginBottom: theme.spacing.xs,
    maxWidth: '90%',
  },
  trackAlbum: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    maxWidth: '90%',
  },
  progressContainer: {
    marginBottom: theme.spacing.xl,
  },
  progressBar: {
    height: 40,
    marginBottom: theme.spacing.sm,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption.fontSize,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    padding: theme.spacing.lg,
  },
  playButton: {
    marginHorizontal: theme.spacing.xl,
  },
  controlIcon: {
    color: theme.colors.text,
    fontSize: 30,
  },
  playIcon: {
    color: theme.colors.text,
    fontSize: 40,
  },
}));

export default PlayerScreen;