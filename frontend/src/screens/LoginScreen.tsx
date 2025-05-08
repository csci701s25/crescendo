import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import SpotifyLoginButton from '../components/auth/SpotifyLoginButton';
import {SpotifyAuthData} from '../services/spotifyAuth';

const {width, height} = Dimensions.get('window');

const LoginScreen = ({navigation}) => {
  // Animation values for the continuous downward movement
  const circleAnim1 = useRef(new Animated.Value(0)).current;
  const circleAnim2 = useRef(new Animated.Value(0)).current;
  const circleAnim3 = useRef(new Animated.Value(0)).current;

  // Start looping animations when component mounts
  useEffect(() => {
    // Create looping animation for first set of circles
    Animated.loop(
      Animated.timing(circleAnim1, {
        toValue: 1,
        duration: 20000, // 20 seconds for one full cycle
        useNativeDriver: true,
        easing: Easing.linear, // Linear movement for seamless loop
      }),
    ).start();

    // Create looping animation for second set of circles with slight delay
    Animated.loop(
      Animated.timing(circleAnim2, {
        toValue: 1,
        duration: 25000, // 25 seconds for one full cycle (slightly different speed)
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();

    // Create looping animation for third set of circles with another delay
    Animated.loop(
      Animated.timing(circleAnim3, {
        toValue: 1,
        duration: 18000, // 18 seconds for one full cycle (different speed)
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
  }, []);

  // Spotify login handler
  const handleLoginSuccess = (userData: SpotifyAuthData) => {
    console.log('User logged in successfully:', userData);
    if (navigation) {
      navigation.navigate('MainTabs');
    }
  };

  // Handler for Skip button
  const handleSkip = () => {
    console.log('Navigating to MapView');
    if (navigation) {
      navigation.navigate('MainTabs');
    }
  };

  // Create multiple instances of each circle to create the continuous loop effect
  const createLoopingCircles = (animValue, baseStyle, topOffset = 0) => {
    // Calculate translateY for the continuous loop effect
    // When the animation value goes from 0 to 1, the circle moves from its starting position
    // to starting position + height, creating the illusion of infinite movement
    const translateY = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [topOffset, topOffset + height],
    });

    // Create two copies of the same circle with identical animation
    // The second copy is positioned exactly one screen height above the first one
    // As they both move down, when the first one exits the bottom, the second one enters the top
    return (
      <>
        <Animated.View style={[baseStyle, {transform: [{translateY}]}]} />
        <Animated.View
          style={[
            baseStyle,
            {top: -height + topOffset, transform: [{translateY}]},
          ]}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Background with animated circles */}
      <View style={styles.backgroundContainer}>
        {/* Create multiple instances of mint circles for looping effect */}
        {createLoopingCircles(circleAnim1, styles.mintCircle, -width * 0.2)}

        {/* Create multiple instances of cream circles for looping effect */}
        {createLoopingCircles(circleAnim2, styles.creamCircle, height * 0.05)}

        {/* Create multiple instances of pink circles for looping effect */}
        {createLoopingCircles(circleAnim3, styles.pinkCircle, height * 0.6)}
      </View>

      {/* Main content with balloon image and text - balloon fixed in position */}
      <View style={styles.contentContainer}>
        {/* Balloon image stays fixed */}
        <Image
          source={require('../../assets/images/crescendo_expo.png')}
          style={styles.balloonImage}
          resizeMode="contain"
        />

        {/* Subtitle text */}
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>Hear What the World is Playing</Text>
          <Text style={styles.subtitleText}>
            Description of the app - lorem ipsum lorem ipsum lorem ipsum lorem
          </Text>
        </View>
      </View>

      {/* Bottom section with buttons */}
      <View style={styles.buttonSection}>
        {/* Connect button (Spotify) */}
        <SpotifyLoginButton onLoginSuccess={handleLoginSuccess} />

        {/* Skip for now text */}
        <TouchableOpacity onPress={handleSkip} style={styles.skipButtonBottom}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  mintCircle: {
    position: 'absolute',
    backgroundColor: '#DCFCE1',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width,
    left: -width * 0.2,
    opacity: 0.8,
    zIndex: -1,
  },
  creamCircle: {
    position: 'absolute',
    backgroundColor: '#FEF9E6',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width,
    right: -width * 0.3,
    opacity: 0.7,
    zIndex: -1,
  },
  pinkCircle: {
    position: 'absolute',
    backgroundColor: '#FADADD',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width,
    right: -width * 0.2,
    opacity: 0.6,
    zIndex: -1,
  },
  skipContainer: {
    position: 'absolute',
    right: 20,
    top: 40,
    zIndex: 10,
  },
  skipText: {
    color: '#333333',
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1, // Ensure content is above the background circles
  },
  balloonImage: {
    marginTop: -20,
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 0,
    textAlign: 'center',
  },
  subtitleText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonSection: {
    marginBottom: 50,
    alignItems: 'center',
    paddingHorizontal: 30,
    zIndex: 1, // Ensure buttons are above the background circles
  },
  skipButtonBottom: {
    padding: 10,
  },
  skipButtonText: {
    color: '#666666',
    fontSize: 14,
  },
});

export default LoginScreen;
