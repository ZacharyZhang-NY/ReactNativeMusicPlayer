package com.musicplayer;

import android.media.MediaPlayer;
import android.media.AudioManager;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class AudioPlayerModule extends ReactContextBaseJavaModule {
    private static final String TAG = "AudioPlayerModule";
    private MediaPlayer mediaPlayer;
    private boolean isPrepared = false;
    private String currentPath = "";
    
    public AudioPlayerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    
    @Override
    public String getName() {
        return "AudioPlayer";
    }
    
    @ReactMethod
    public void play(String filepath, Promise promise) {
        try {
            if (mediaPlayer != null && !filepath.equals(currentPath)) {
                mediaPlayer.release();
                mediaPlayer = null;
                isPrepared = false;
            }
            
            if (mediaPlayer == null) {
                mediaPlayer = new MediaPlayer();
                mediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
                
                mediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                    @Override
                    public void onCompletion(MediaPlayer mp) {
                        sendEvent("onTrackEnd");
                    }
                });
                
                mediaPlayer.setOnErrorListener(new MediaPlayer.OnErrorListener() {
                    @Override
                    public boolean onError(MediaPlayer mp, int what, int extra) {
                        Log.e(TAG, "MediaPlayer error: " + what + ", " + extra);
                        sendEvent("onError");
                        return true;
                    }
                });
            }
            
            if (!filepath.equals(currentPath) || !isPrepared) {
                mediaPlayer.reset();
                mediaPlayer.setDataSource(filepath);
                mediaPlayer.prepare();
                currentPath = filepath;
                isPrepared = true;
            }
            
            mediaPlayer.start();
            promise.resolve(true);
            
        } catch (IOException e) {
            Log.e(TAG, "Error playing audio: " + e.getMessage());
            promise.reject("PLAY_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void pause(Promise promise) {
        if (mediaPlayer != null && mediaPlayer.isPlaying()) {
            mediaPlayer.pause();
            promise.resolve(true);
        } else {
            promise.resolve(false);
        }
    }
    
    @ReactMethod
    public void resume(Promise promise) {
        if (mediaPlayer != null && !mediaPlayer.isPlaying() && isPrepared) {
            mediaPlayer.start();
            promise.resolve(true);
        } else {
            promise.resolve(false);
        }
    }
    
    @ReactMethod
    public void stop(Promise promise) {
        if (mediaPlayer != null) {
            if (mediaPlayer.isPlaying()) {
                mediaPlayer.stop();
            }
            mediaPlayer.release();
            mediaPlayer = null;
            isPrepared = false;
            currentPath = "";
            promise.resolve(true);
        } else {
            promise.resolve(false);
        }
    }
    
    @ReactMethod
    public void seekTo(double seconds, Promise promise) {
        if (mediaPlayer != null && isPrepared) {
            mediaPlayer.seekTo((int)(seconds * 1000));
            promise.resolve(true);
        } else {
            promise.resolve(false);
        }
    }
    
    @ReactMethod
    public void getCurrentPosition(Promise promise) {
        if (mediaPlayer != null && isPrepared) {
            double position = mediaPlayer.getCurrentPosition() / 1000.0;
            promise.resolve(position);
        } else {
            promise.resolve(0.0);
        }
    }
    
    @ReactMethod
    public void getDuration(Promise promise) {
        if (mediaPlayer != null && isPrepared) {
            double duration = mediaPlayer.getDuration() / 1000.0;
            promise.resolve(duration);
        } else {
            promise.resolve(0.0);
        }
    }
    
    @ReactMethod
    public void isPlaying(Promise promise) {
        if (mediaPlayer != null) {
            promise.resolve(mediaPlayer.isPlaying());
        } else {
            promise.resolve(false);
        }
    }
    
    @ReactMethod
    public void setVolume(float volume, Promise promise) {
        if (mediaPlayer != null) {
            mediaPlayer.setVolume(volume, volume);
            promise.resolve(true);
        } else {
            promise.resolve(false);
        }
    }
    
    private void sendEvent(String eventName) {
        WritableMap params = Arguments.createMap();
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }
}