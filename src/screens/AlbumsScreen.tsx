import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { RootStackParamList, Album } from '../types';
import { mockAlbums } from '../services/MockMusicService';
import { MusicService } from '../services/MusicService';

type AlbumsScreenRouteProp = RouteProp<RootStackParamList, 'Albums'>;
type AlbumsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Albums'>;

const AlbumsScreen = () => {
  const navigation = useNavigation<AlbumsScreenNavigationProp>();
  const route = useRoute<AlbumsScreenRouteProp>();
  const { artist } = route.params;
  const { styles } = useStyles(stylesheet);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      title: artist.name,
    });
    loadAlbums();
  }, [artist, navigation]);

  const loadAlbums = async () => {
    try {
      const musicService = MusicService.getInstance();
      const libraryAlbums = musicService.getAlbumsByArtist(artist.id);
      
      // 如果没有找到专辑，使用模拟数据
      if (libraryAlbums.length === 0) {
        const mockAlbumsForArtist = mockAlbums.filter(
          (album) => album.artistId === artist.id
        );
        setAlbums(mockAlbumsForArtist);
      } else {
        setAlbums(libraryAlbums);
      }
    } catch (error) {
      console.error('加载专辑失败:', error);
      const mockAlbumsForArtist = mockAlbums.filter(
        (album) => album.artistId === artist.id
      );
      setAlbums(mockAlbumsForArtist);
    } finally {
      setLoading(false);
    }
  };

  const renderAlbum = ({ item }: { item: Album }) => (
    <TouchableOpacity
      style={styles.albumCard}
      onPress={() => navigation.navigate('Tracks', { album: item })}
    >
      <View style={styles.albumCover}>
        <Text style={styles.albumCoverText}>
          {item.title.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.albumTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.albumInfo}>
        {item.year || '未知年份'} • {item.trackCount} 首
      </Text>
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
      <FlatList
        data={albums}
        renderItem={renderAlbum}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>该艺术家暂无专辑</Text>
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
  list: {
    padding: theme.spacing.sm,
  },
  albumCard: {
    flex: 1,
    margin: theme.spacing.sm,
  },
  albumCover: {
    aspectRatio: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    marginBottom: theme.spacing.sm,
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
  albumTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.subtitle.fontWeight,
    marginBottom: 4,
  },
  albumInfo: {
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

export default AlbumsScreen;