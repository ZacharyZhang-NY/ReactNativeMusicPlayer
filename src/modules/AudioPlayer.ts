import { NativeModules, NativeEventEmitter } from 'react-native';

interface AudioPlayerInterface {
  play(filepath: string): Promise<boolean>;
  pause(): Promise<boolean>;
  resume(): Promise<boolean>;
  stop(): Promise<boolean>;
  seekTo(seconds: number): Promise<boolean>;
  getCurrentPosition(): Promise<number>;
  getDuration(): Promise<number>;
  isPlaying(): Promise<boolean>;
  setVolume(volume: number): Promise<boolean>;
}

const { AudioPlayer } = NativeModules;

export const AudioPlayerModule = AudioPlayer as AudioPlayerInterface;

// 创建事件监听器
export const AudioPlayerEvents = new NativeEventEmitter(AudioPlayer);

// 事件类型
export const AudioEvents = {
  ON_TRACK_END: 'onTrackEnd',
  ON_ERROR: 'onError',
};