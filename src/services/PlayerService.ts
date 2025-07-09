import Sound from 'react-native-sound';
import { Track } from '../types';

// 启用播放模式
Sound.setCategory('Playback');

let currentSound: Sound | null = null;
let currentTrack: Track | null = null;
let playlist: Track[] = [];
let currentIndex = 0;
let isPlaying = false;

export const setupPlayer = async () => {
  // react-native-sound 不需要初始化设置
  return true;
};

export const playTrack = async (track: Track, newPlaylist: Track[] = []) => {
  // 停止当前播放
  if (currentSound) {
    currentSound.stop();
    currentSound.release();
    currentSound = null;
  }

  // 更新播放列表
  if (newPlaylist.length > 0) {
    playlist = newPlaylist;
    currentIndex = playlist.findIndex(t => t.id === track.id);
    if (currentIndex === -1) currentIndex = 0;
  } else {
    playlist = [track];
    currentIndex = 0;
  }

  currentTrack = track;
  
  return new Promise<void>((resolve, reject) => {
    currentSound = new Sound(track.path, '', (error) => {
      if (error) {
        console.log('加载音频失败:', error);
        reject(error);
        return;
      }

      // 播放音频
      currentSound?.play((success) => {
        if (success) {
          console.log('播放完成');
          // 自动播放下一首
          skipToNext();
        } else {
          console.log('播放失败');
        }
      });

      isPlaying = true;
      resolve();
    });
  });
};

export const togglePlayback = async () => {
  if (!currentSound) return;

  if (isPlaying) {
    currentSound.pause();
    isPlaying = false;
  } else {
    currentSound.play();
    isPlaying = true;
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
  if (currentSound) {
    currentSound.setCurrentTime(position);
  }
};

export const getCurrentPosition = (): Promise<number> => {
  return new Promise((resolve) => {
    if (currentSound) {
      currentSound.getCurrentTime((seconds) => {
        resolve(seconds);
      });
    } else {
      resolve(0);
    }
  });
};

export const getDuration = (): number => {
  if (currentSound) {
    return currentSound.getDuration();
  }
  return 0;
};

export const getIsPlaying = (): boolean => {
  return isPlaying;
};

export const getCurrentTrack = (): Track | null => {
  return currentTrack;
};