import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { RootStackParamList, Artist } from '../types';
import { mockArtists } from '../services/MockMusicService';
import { MusicService } from '../services/MusicService';

type ArtistsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Artists'>;

const ArtistsScreen = () => {
  const navigation = useNavigation<ArtistsScreenNavigationProp>();
  const { styles } = useStyles(stylesheet);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      const musicService = MusicService.getInstance();
      await musicService.loadLibrary();
      const libraryArtists = musicService.getArtists();
      
      // 如果没有扫描到音乐，使用模拟数据
      if (libraryArtists.length === 0) {
        setArtists(mockArtists);
      } else {
        setArtists(libraryArtists);
      }
    } catch (error) {
      console.error('加载艺术家失败:', error);
      setArtists(mockArtists);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const musicService = MusicService.getInstance();
    
    try {
      await musicService.scanMusicFiles();
      await loadArtists();
    } catch (error) {
      console.error('扫描音乐文件失败:', error);
      await loadArtists();
    }
  };

  const renderArtist = ({ item }: { item: Artist }) => (
    <TouchableOpacity
      style={styles.artistCard}
      onPress={() => navigation.navigate('Albums', { artist: item })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.artistName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.albumCount}>
        {item.albumCount} {item.albumCount === 1 ? '专辑' : '专辑'}
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
        data={artists}
        renderItem={renderArtist}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>未找到音乐文件</Text>
            <Text style={styles.emptySubText}>下拉刷新扫描音乐文件</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#fff"
          />
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
  artistCard: {
    flex: 1,
    margin: theme.spacing.sm,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatarText: {
    color: theme.colors.text,
    fontSize: 48,
    fontWeight: 'bold',
  },
  artistName: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.subtitle.fontWeight,
    marginBottom: 4,
    width: 120,
    textAlign: 'center',
  },
  albumCount: {
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
    fontWeight: theme.typography.subtitle.fontWeight,
    marginBottom: theme.spacing.sm,
  },
  emptySubText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
  },
}));

export default ArtistsScreen;