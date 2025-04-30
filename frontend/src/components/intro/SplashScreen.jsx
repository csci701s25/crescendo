import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import VideoAnimation from './VideoAnimation';

const SplashScreen = ({onAnimationComplete}) => {
  useEffect(() => {
    console.log('SplashScreen mounted');

    // This is a backup timeout in case animation fails to trigger onAnimationComplete
    const backupTimeout = setTimeout(() => {
      console.log('SplashScreen backup timeout triggered');
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 6000); // 6 second backup

    return () => clearTimeout(backupTimeout);
  }, [onAnimationComplete]);

  const handleAnimationComplete = () => {
    console.log('Animation completed, moving to signup');
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  return (
    <View style={styles.container}>
      <VideoAnimation onAnimationComplete={handleAnimationComplete} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
});

export default SplashScreen;
