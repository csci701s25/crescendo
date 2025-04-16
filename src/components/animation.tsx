import React, {useRef, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

const AnimationScreen = () => {
  const animation = useRef(null);

  useEffect(() => {
    // You can add animation controls here if needed
    // For example, animation.current?.play();
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animation}
        style={styles.animation}
        source={require('../../assets/animations/Main.json')}
        autoPlay={true}
        loop={false}
        // Important: Adding onError handler to catch loading issues
        onError={error => console.log('Lottie error:', error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  animation: {
    width: 400,
    height: 400,
    backgroundColor: 'transparent',
  },
});

export default AnimationScreen;
