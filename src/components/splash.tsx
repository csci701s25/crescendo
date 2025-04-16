import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import AnimationScreen from './animation';

const SplashScreen = ({onAnimationComplete}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate asset loading time
    // In a real app, you would wait for actual assets to load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Image
          source={require('../../assets/animations/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      ) : (
        <AnimationScreen />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default SplashScreen;
