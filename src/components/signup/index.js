import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';

// Get screen dimensions
const {width, height} = Dimensions.get('window');
// Calculate status bar height to account for notches and status bars
const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 0;

const IMAGES = [
  require('../../../assets/signup/1.jpg'),
  require('../../../assets/signup/2.jpg'),
  require('../../../assets/signup/3.jpg'),
  require('../../../assets/signup/cres1.jpg'),
  require('../../../assets/signup/cres2.jpg'),
  require('../../../assets/signup/cres3.jpg'),
];

const SignUp = ({navigation}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const isTransitioning = useRef(false);
  const fadeAnimCurrent = useRef(new Animated.Value(1)).current;
  const fadeAnimNext = useRef(new Animated.Value(0)).current;
  const scaleAnimCurrent = useRef(new Animated.Value(1.1)).current;
  const scaleAnimNext = useRef(new Animated.Value(1.1)).current;
  const animationRef = useRef(null);
  const intervalRef = useRef(null);

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      try {
        setTimeout(() => {
          setImagesLoaded(true);
        }, 100);
      } catch (error) {
        console.error('Error preloading images:', error);
      }
    };

    preloadImages();
  }, []);

  const handleSkip = () => {
    console.log('Navigating to MapView');
    navigation.navigate('MapView');
  };

  // Complete the transition and prepare for the next one
  const finishTransition = useCallback(() => {
    // Update indices
    setCurrentImageIndex(prevIndex => nextImageIndex);
    setNextImageIndex(prevNext => (prevNext + 1) % IMAGES.length);

    // Reset animation values
    fadeAnimCurrent.setValue(1);
    fadeAnimNext.setValue(0);

    // Reset transition flag after a short delay to prevent race conditions
    setTimeout(() => {
      isTransitioning.current = false;
    }, 50);
  }, [fadeAnimCurrent, fadeAnimNext, nextImageIndex]);

  // Start a transition to the next image
  const startTransition = useCallback(() => {
    // Prevent multiple transitions or starting when animation is in progress
    if (isTransitioning.current) return;

    isTransitioning.current = true;

    // Prepare for animation
    scaleAnimNext.setValue(1.1);

    // Create animation sequence
    animationRef.current = Animated.parallel([
      // Current image: fade out and zoom in
      Animated.timing(fadeAnimCurrent, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimCurrent, {
        toValue: 1.3,
        duration: 6000,
        useNativeDriver: true,
      }),
      // Next image: fade in and zoom in
      Animated.timing(fadeAnimNext, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimNext, {
        toValue: 1.2,
        duration: 6000,
        useNativeDriver: true,
      }),
    ]);

    // Start the animation
    animationRef.current.start(({finished}) => {
      // Only finish transition if animation completed normally
      if (finished) {
        finishTransition();
      }
    });
  }, [
    fadeAnimCurrent,
    fadeAnimNext,
    scaleAnimCurrent,
    scaleAnimNext,
    finishTransition,
  ]);

  // Automatically transition between images once they're loaded
  useEffect(() => {
    if (!imagesLoaded) return;

    // Clear any existing interval to prevent stacking
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start first transition and set up interval
    const startFirstTransition = () => {
      // Start first transition after a short delay to ensure component is fully mounted
      setTimeout(() => {
        if (!isTransitioning.current) {
          startTransition();
        }
      }, 500);

      // Set up interval for subsequent transitions
      intervalRef.current = setInterval(() => {
        if (!isTransitioning.current) {
          startTransition();
        }
      }, 7000); // Longer than animation duration to prevent overlap
    };

    startFirstTransition();

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [imagesLoaded, startTransition]);

  return (
    <View style={styles.container}>
      {/* Make status bar transparent */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Hidden container to preload all images */}
      <View style={{position: 'absolute', opacity: 0, width: 1, height: 1}}>
        {IMAGES.map((img, index) => (
          <Image key={`preload-${index}`} source={img} />
        ))}
      </View>

      {/* Current visible image with animation */}
      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: fadeAnimCurrent,
            transform: [{scale: scaleAnimCurrent}],
          },
        ]}>
        <Image
          source={IMAGES[currentImageIndex]}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        {/* Darkening overlay */}
        <View style={styles.overlay} />
      </Animated.View>

      {/* Next image that fades in */}
      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: fadeAnimNext,
            transform: [{scale: scaleAnimNext}],
          },
        ]}>
        <Image
          source={IMAGES[nextImageIndex]}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        {/* Darkening overlay */}
        <View style={styles.overlay} />
      </Animated.View>

      {/* Logo at the top left, accounting for status bar */}
      <View style={[styles.logoContainer, {marginTop: STATUSBAR_HEIGHT}]}>
        <Image
          source={require('../../../assets/signup/logoCres.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Text content at the bottom */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Crescendo</Text>
        <Text style={styles.subtitle}>
          Music connects us. Crescendo makes it visible.
        </Text>
      </View>

      {/* Buttons at the
      , side by side */}
      {/* Buttons at the bottom, side by side */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Privacy link at the bottom*/}
      <TouchableOpacity style={styles.privacyButton} onPress={handleSkip}>
        <Text style={styles.privacyText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background to avoid any white showing
  },
  imageContainer: {
    position: 'absolute',
    width: width,
    height: height,
    // Center the image container to allow for proper scaling/zooming
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // This prevents scaled images from leaking outside
  },
  backgroundImage: {
    width: width * 1.2, // Make the image larger than the screen to allow for zoom
    height: height * 1.2, // Make the image larger than the screen to allow for zoom
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  logoContainer: {
    position: 'absolute',
    top: 10,
    left: 30,
    zIndex: 10,
  },
  logo: {
    width: 150,
    height: 60,
  },
  textContainer: {
    position: 'absolute',
    bottom: 130,
    left: 30,
    right: 30,
  },
  title: {
    color: '#fff',
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    color: '#AAAAAA',
    fontSize: 20,
    fontWeight: '400',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  joinButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    height: 40,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  signInButton: {
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    height: 40,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  privacyButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  privacyText: {
    color: '#AAAAAA',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});

export default SignUp;
