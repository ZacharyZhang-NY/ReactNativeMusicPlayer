// 音频播放服务
import { Track } from '../types';
import { AudioPlayerModule, AudioPlayerEvents, AudioEvents } from '../modules/AudioPlayer';
import { Platform } from 'react-native';

let currentTrack: Track | null = null;
let playlist: Track[] = [];
let currentIndex = 0;
let isPlaying = false;
let currentPosition = 0;
let positionInterval: NodeJS.Timeout | null = null;
let eventSubscription: any = null;

export const setupPlayer = async () => {
  // 设置事件监听
  if (!eventSubscription) {
    eventSubscription = AudioPlayerEvents.addListener(AudioEvents.ON_TRACK_END, () => {
      // 自动播放下一首
      skipToNext();
    });
  }
  return true;
};

export const playTrack = async (track: Track, newPlaylist: Track[] = []) => {
  if (newPlaylist.length > 0) {
    playlist = newPlaylist;
    currentIndex = playlist.findIndex(t => t.id === track.id);
    if (currentIndex === -1) currentIndex = 0;
  } else {
    playlist = [track];
    currentIndex = 0;
  }

  currentTrack = track;
  
  try {
    // 如果是Android平台，使用原生播放器
    if (Platform.OS === 'android' && AudioPlayerModule) {
      await AudioPlayerModule.play(track.path);
      isPlaying = true;
      
      // 更新播放进度
      if (positionInterval) {
        clearInterval(positionInterval);
      }
      
      positionInterval = setInterval(async () => {
        if (isPlaying) {
          try {
            const pos = await AudioPlayerModule.getCurrentPosition();
            currentPosition = pos;
          } catch (error) {
            console.error('获取播放位置失败:', error);
          }
        }
      }, 1000);
    } else {
      // 降级到模拟播放
      isPlaying = true;
      currentPosition = 0;
      
      const interval = setInterval(() => {
        if (isPlaying && currentTrack) {
          currentPosition += 1;
          if (currentPosition >= currentTrack.duration) {
            clearInterval(interval);
            skipToNext();
          }
        }
      }, 1000);
    }
  } catch (error) {
    console.error('播放失败:', error);
    isPlaying = false;
  }
};

export const togglePlayback = async () => {
  try {
    if (Platform.OS === 'android' && AudioPlayerModule) {
      if (isPlaying) {
        await AudioPlayerModule.pause();
        isPlaying = false;
      } else {
        await AudioPlayerModule.resume();
        isPlaying = true;
      }
    } else {
      isPlaying = !isPlaying;
    }
  } catch (error) {
    console.error('切换播放状态失败:', error);
  }
};

export const skipToNext = async () => {
  if (currentIndex < playlist.length - 1) {
    currentIndex++;
    await playTrack(playlist[currentIndex], playlist);
  }
};

export const skipToPrevious = async () => {
  if (currentIndex > 0) {
    currentIndex--;
    await playTrack(playlist[currentIndex], playlist);
  }
};

export const seekTo = async (position: number) => {
  try {
    if (Platform.OS === 'android' && AudioPlayerModule) {
      await AudioPlayerModule.seekTo(position);
    }
    currentPosition = position;
  } catch (error) {
    console.error('跳转失败:', error);
  }
};

export const getCurrentPosition = async (): Promise<number> => {
  try {
    if (Platform.OS === 'android' && AudioPlayerModule) {
      const pos = await AudioPlayerModule.getCurrentPosition();
      currentPosition = pos;
      return pos;
    }
  } catch (error) {
    console.error('获取播放位置失败:', error);
  }
  return currentPosition;
};

export const getDuration = async (): Promise<number> => {
  try {
    if (Platform.OS === 'android' && AudioPlayerModule && currentTrack) {
      const duration = await AudioPlayerModule.getDuration();
      if (duration > 0) {
        return duration;
      }
    }
  } catch (error) {
    console.error('获取时长失败:', error);
  }
  return currentTrack?.duration || 0;
};

export const getIsPlaying = (): boolean => {
  return isPlaying;
};

export const getCurrentTrack = (): Track | null => {
  return currentTrack;
};