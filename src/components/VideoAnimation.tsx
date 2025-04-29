import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Video from 'react-native-video';

const {width, height} = Dimensions.get('window');

const VideoAnimation = ({onAnimationComplete}) => {
  const videoRef = useRef(null);

  const handleEnd = () => {
    console.log('Video animation ended');
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  useEffect(() => {
    // Fallback in case the video doesn't trigger onEnd
    const timer = setTimeout(() => {
      console.log('Video fallback timer triggered');
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 5000); // Set this to slightly longer than your video duration

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={require('../../assets/animations/animation.mp4')}
          style={styles.video}
          resizeMode="contain"
          onEnd={handleEnd}
          onError={error => {
            console.log('Video error:', error);
            if (onAnimationComplete) {
              onAnimationComplete();
            }
          }}
          repeat={false}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
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
    width: width * 0.85, // Reduce to 85% of screen width
    height: height * 0.85, // Reduce to 85% of screen height
  },
});

export default VideoAnimation;
