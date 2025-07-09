import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { RootStackParamList, Track } from '../types';
import { mockTracks } from '../services/MockMusicService';
import { MusicService } from '../services/MusicService';
import { playTrack } from '../services/PlayerService';

type TracksScreenRouteProp = RouteProp<RootStackParamList, 'Tracks'>;
type TracksScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Tracks'>;

const TracksScreen = () => {
  const navigation = useNavigation<TracksScreenNavigationProp>();
  const route = useRoute<TracksScreenRouteProp>();
  const { album } = route.params;
  const { styles } = useStyles(stylesheet);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      title: album.title,
    });
    loadTracks();
  }, [album, navigation]);

  const loadTracks = async () => {
    try {
      const musicService = MusicService.getInstance();
      const libraryTracks = musicService.getTracksByAlbum(album.id);
      
      // 如果没有找到歌曲，使用模拟数据
      if (libraryTracks.length === 0) {
        const mockTracksForAlbum = mockTracks.filter(
          (track) => track.albumId === album.id
        );
        setTracks(mockTracksForAlbum);
      } else {
        setTracks(libraryTracks);
      }
    } catch (error) {
      console.error('加载歌曲失败:', error);
      const mockTracksForAlbum = mockTracks.filter(
        (track) => track.albumId === album.id
      );
      setTracks(mockTracksForAlbum);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayTrack = async (track: Track) => {
    try {
      await playTrack(track, tracks);
      navigation.navigate('Player', { track: track, playlist: tracks });
    } catch (error) {
      console.error('播放失败:', error);
    }
  };

  const renderTrack = ({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => handlePlayTrack(item)}
    >
      <Text style={styles.trackNumber}>{index + 1}</Text>
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <Text style={styles.trackDuration}>{formatDuration(item.duration)}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.albumHeader}>
        <View style={styles.albumCover}>
          <Text style={styles.albumCoverText}>
            {album.title.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.albumInfo}>
          <Text style={styles.albumTitle} numberOfLines={1}>
            {album.title}
          </Text>
          <Text style={styles.albumArtist} numberOfLines={1}>
            {album.artistName}
          </Text>
          <Text style={styles.albumMeta}>
            {album.year || '未知年份'} • {album.trackCount} 首
          </Text>
          <TouchableOpacity
            style={styles.playAllButton}
            onPress={() => tracks.length > 0 && handlePlayTrack(tracks[0])}
          >
            <Text style={styles.playAllText}>播放全部</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={tracks}
        renderItem={renderTrack}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>该专辑暂无歌曲</Text>
          </View>
        }
      />
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
  },
  albumHeader: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  albumCover: {
    width: 120,
    height: 120,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    marginRight: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  albumCoverText: {
    color: theme.colors.text,
    fontSize: 48,
    fontWeight: 'bold',
  },
  albumInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  albumTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    marginBottom: theme.spacing.xs,
  },
  albumArtist: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    marginBottom: theme.spacing.xs,
  },
  albumMeta: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption.fontSize,
    marginBottom: theme.spacing.sm,
  },
  playAllButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  playAllText: {
    color: '#FFFFFF',
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  list: {
    paddingVertical: theme.spacing.sm,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  trackNumber: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    width: 30,
    textAlign: 'center',
  },
  trackInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  trackTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    marginBottom: 2,
  },
  trackArtist: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption.fontSize,
  },
  trackDuration: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption.fontSize,
  },
  emptyContainer: {
    flex: 1,
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: theme.colors.text,
    fontSize: theme.typography.subtitle.fontSize,
  },
}));

export default TracksScreen;