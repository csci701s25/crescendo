import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Video} from 'expo-av';

const {width, height} = Dimensions.get('window');

const VideoAnimation = ({onAnimationComplete}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Load and play the video
    const loadVideo = async () => {
      try {
        if (videoRef.current) {
          await videoRef.current.loadAsync(
            require('../../../assets/animations/animation.mp4'),
            {},
            false,
          );
          await videoRef.current.playAsync();
          console.log('Video loaded and playing');
        }
      } catch (error) {
        console.error('Error loading video:', error);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    };

    loadVideo();

    // Fallback timer in case video doesn't trigger end event
    const timer = setTimeout(() => {
      console.log('Video fallback timer triggered');
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 5000); // Set this to slightly longer than your video duration

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  const handlePlaybackStatusUpdate = status => {
    console.log('Video status:', status);
    if (status.didJustFinish) {
      console.log('Video animation ended');
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          style={styles.video}
          resizeMode="contain"
          shouldPlay={false} // Will be played in useEffect
          isLooping={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onError={error => {
            console.log('Video error:', error);
            if (onAnimationComplete) {
              onAnimationComplete();
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', // Black background
  },
  videoContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50, // Move video up by 50 points
  },
  video: {
    width: width * 1.5, // Increased from 0.85 to 1.1 for more zoom
    height: height * 1.5, // Increased from 0.85 to 1.1 for more zoom
  },
});

export default VideoAnimation;
