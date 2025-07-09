import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import { Artist, Album, Track } from '../types';

const STORAGE_KEY = '@MusicPlayer:library';

interface MusicLibrary {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
  lastScanned?: number;
}

export class MusicService {
  private static instance: MusicService;
  private library: MusicLibrary = {
    artists: [],
    albums: [],
    tracks: [],
  };

  private constructor() {}

  static getInstance(): MusicService {
    if (!MusicService.instance) {
      MusicService.instance = new MusicService();
    }
    return MusicService.instance;
  }

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        
        return (
          granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === 
          PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }

  async scanMusicFiles(): Promise<void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('需要存储权限来扫描音乐文件');
    }

    try {
      // 简化的音乐扫描实现
      // 在实际应用中，你可能需要使用原生模块来获取音乐元数据
      const musicExtensions = ['.mp3', '.m4a', '.wav', '.flac', '.aac'];
      const musicFiles: any[] = [];
      
      // Android 音乐目录
      const musicDirs = Platform.OS === 'android' 
        ? [
            RNFS.ExternalStorageDirectoryPath + '/Music',
            RNFS.ExternalStorageDirectoryPath + '/Download',
            RNFS.ExternalStorageDirectoryPath + '/媒体/音乐',
          ]
        : [RNFS.DocumentDirectoryPath];

      for (const dir of musicDirs) {
        try {
          const exists = await RNFS.exists(dir);
          if (exists) {
            await this.scanDirectory(dir, musicExtensions, musicFiles);
          }
        } catch (error) {
          console.log(`扫描目录 ${dir} 失败:`, error);
        }
      }
      
      if (musicFiles.length > 0) {
        this.processScannedFiles(musicFiles);
        await this.saveLibrary();
      }
    } catch (error) {
      console.error('扫描音乐文件时出错:', error);
      throw error;
    }
  }

  private async scanDirectory(
    path: string, 
    extensions: string[], 
    results: any[]
  ): Promise<void> {
    try {
      const items = await RNFS.readDir(path);
      
      for (const item of items) {
        if (item.isFile()) {
          const ext = '.' + item.name.split('.').pop()?.toLowerCase();
          if (extensions.includes(ext)) {
            // 简化的音乐文件对象
            results.push({
              path: item.path,
              title: item.name.replace(/\.[^/.]+$/, ''),
              artist: '未知艺术家',
              album: '未知专辑',
              duration: 180000, // 默认3分钟
              size: item.size,
            });
          }
        } else if (item.isDirectory() && !item.name.startsWith('.')) {
          // 递归扫描子目录
          await this.scanDirectory(item.path, extensions, results);
        }
      }
    } catch (error) {
      console.log(`扫描目录失败: ${path}`, error);
    }
  }

  private processScannedFiles(files: any[]): void {
    const artistMap = new Map<string, Artist>();
    const albumMap = new Map<string, Album>();
    const tracks: Track[] = [];

    files.forEach((file) => {
      const artistName = file.artist || '未知艺术家';
      const albumTitle = file.album || '未知专辑';
      const artistId = this.generateId(artistName);
      const albumId = this.generateId(`${artistName}-${albumTitle}`);

      // 处理艺术家
      if (!artistMap.has(artistId)) {
        artistMap.set(artistId, {
          id: artistId,
          name: artistName,
          albumCount: 0,
          avatar: undefined,
        });
      }

      // 处理专辑
      if (!albumMap.has(albumId)) {
        const artist = artistMap.get(artistId)!;
        artist.albumCount++;
        
        albumMap.set(albumId, {
          id: albumId,
          artistId: artistId,
          artistName: artistName,
          title: albumTitle,
          cover: undefined,
          year: undefined,
          trackCount: 0,
        });
      }

      const album = albumMap.get(albumId)!;
      album.trackCount++;

      // 处理歌曲
      tracks.push({
        id: this.generateId(file.path),
        albumId: albumId,
        artistId: artistId,
        title: file.title || '未知歌曲',
        artist: artistName,
        album: albumTitle,
        duration: Math.floor(file.duration / 1000), // 转换为秒
        path: file.path,
        cover: undefined,
      });
    });

    this.library = {
      artists: Array.from(artistMap.values()),
      albums: Array.from(albumMap.values()),
      tracks: tracks,
      lastScanned: Date.now(),
    };
  }

  private generateId(input: string): string {
    return input.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  async loadLibrary(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.library = JSON.parse(stored);
      }
    } catch (error) {
      console.error('加载音乐库时出错:', error);
    }
  }

  async saveLibrary(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.library));
    } catch (error) {
      console.error('保存音乐库时出错:', error);
    }
  }

  getArtists(): Artist[] {
    return this.library.artists.sort((a, b) => a.name.localeCompare(b.name));
  }

  getAlbumsByArtist(artistId: string): Album[] {
    return this.library.albums
      .filter((album) => album.artistId === artistId)
      .sort((a, b) => a.title.localeCompare(b.title));
  }

  getTracksByAlbum(albumId: string): Track[] {
    return this.library.tracks
      .filter((track) => track.albumId === albumId)
      .sort((a, b) => a.title.localeCompare(b.title));
  }

  getAllTracks(): Track[] {
    return this.library.tracks;
  }

  getTrackById(trackId: string): Track | undefined {
    return this.library.tracks.find((track) => track.id === trackId);
  }

  needsRescan(): boolean {
    if (!this.library.lastScanned) return true;
    
    // 如果超过24小时没有扫描，建议重新扫描
    const dayInMs = 24 * 60 * 60 * 1000;
    return Date.now() - this.library.lastScanned > dayInMs;
  }
}