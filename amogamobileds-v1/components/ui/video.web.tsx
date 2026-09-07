import { useColor } from '@/hooks/useColor';
import { BORDER_RADIUS } from '@/theme/globals';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react-native';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

export type VideoSource = string | number | { uri: string } | null;

export interface VideoProps {
  source: VideoSource;
  style?: ViewStyle;
  seekBy?: number;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  nativeControls?: boolean;
  showControls?: boolean;
  allowsFullscreen?: boolean;
  allowsPictureInPicture?: boolean;
  contentFit?: 'contain' | 'cover' | 'fill';
  onLoad?: () => void;
  onError?: (error: any) => void;
  onPlaybackStatusUpdate?: (status: any) => void;
  onFullscreenUpdate?: (isFullscreen: boolean) => void;
  subtitles?: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

export interface VideoRef {
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  isPlaying: () => boolean;
  isMuted: () => boolean;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const Video = forwardRef<VideoRef, VideoProps>(
  (
    {
      source,
      style,
      autoPlay = false,
      loop = false,
      muted = false,
      nativeControls = false,
      contentFit = 'cover',
      onLoad,
      onError,
      seekBy = 2,
      onPlaybackStatusUpdate,
      subtitles = [],
    },
    ref
  ) => {
    const textColor = useColor('text');
    const cardColor = useColor('card');
    const mutedColor = useColor('mutedForeground');

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlayingState, setIsPlayingState] = useState(autoPlay);
    const [isMutedState, setIsMutedState] = useState(muted);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const getUri = (): string => {
      if (!source) return '';
      if (typeof source === 'string') return source;
      if (typeof source === 'object' && 'uri' in source && source.uri) return source.uri;
      return '';
    };

    const uri = getUri();

    useImperativeHandle(ref, () => ({
      play: () => videoRef.current?.play(),
      pause: () => videoRef.current?.pause(),
      seekTo: (seconds: number) => {
        if (videoRef.current) videoRef.current.currentTime = seconds;
      },
      setVolume: (volume: number) => {
        if (videoRef.current) videoRef.current.volume = volume;
      },
      getCurrentTime: () => videoRef.current?.currentTime || 0,
      getDuration: () => videoRef.current?.duration || 0,
      isPlaying: () => !videoRef.current?.paused,
      isMuted: () => !!videoRef.current?.muted,
    }));

    const togglePlay = useCallback(() => {
      if (!videoRef.current) return;
      if (videoRef.current.paused) {
        videoRef.current.play().catch(onError);
        setIsPlayingState(true);
      } else {
        videoRef.current.pause();
        setIsPlayingState(false);
      }
    }, [onError]);

    const toggleMute = useCallback(() => {
      if (!videoRef.current) return;
      videoRef.current.muted = !videoRef.current.muted;
      setIsMutedState(videoRef.current.muted);
    }, []);

    return (
      <View style={[styles.container, style]}>
        <video
          ref={videoRef}
          src={uri}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          controls={nativeControls}
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: contentFit,
            borderRadius: BORDER_RADIUS,
            backgroundColor: '#000',
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setDuration(videoRef.current.duration || 0);
              onLoad?.();
            }
          }}
          onTimeUpdate={() => {
            if (videoRef.current) {
              const cur = videoRef.current.currentTime || 0;
              const dur = videoRef.current.duration || 0;
              setCurrentTime(cur);
              setDuration(dur);
              onPlaybackStatusUpdate?.({
                currentTime: cur,
                duration: dur,
                isPlaying: !videoRef.current.paused,
              });
            }
          }}
          onPlay={() => setIsPlayingState(true)}
          onPause={() => setIsPlayingState(false)}
          onError={(e) => onError?.(e)}
        />

        {!nativeControls && (
          <View style={[styles.overlayControls, { backgroundColor: cardColor + 'CC' }]}>
            <TouchableOpacity onPress={togglePlay} style={styles.controlBtn}>
              {isPlayingState ? (
                <Pause size={18} color={textColor} />
              ) : (
                <Play size={18} color={textColor} />
              )}
            </TouchableOpacity>

            <Text style={[styles.timeText, { color: textColor }]}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>

            <View style={{ flex: 1 }} />

            <TouchableOpacity onPress={toggleMute} style={styles.controlBtn}>
              {isMutedState ? (
                <VolumeX size={18} color={mutedColor} />
              ) : (
                <Volume2 size={18} color={textColor} />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
);

Video.displayName = 'Video';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
  },
  overlayControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  controlBtn: {
    padding: 6,
    borderRadius: 6,
  },
  timeText: {
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    fontWeight: '500',
  },
});
