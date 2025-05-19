import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  StatusBar,
  Platform,
  Easing,
} from 'react-native';
import SpotifyLoginButton from '../components/auth/SpotifyLoginButton';

const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? 47 : StatusBar.currentHeight || 0;

// Improved iPad detection
const isIPad = () => {
  // On iOS, check for iPad idiom if available
  if (Platform.OS === 'ios' && Platform.isPad) {
    return true;
  }

  // Fallback method - check for tablet-like dimensions AND on iOS
  // This helps prevent larger iPhones from being detected as iPads
  const aspectRatio = height / width;
  const isTabletSize = width > 768 && height > 768;
  return Platform.OS === 'ios' && isTabletSize && aspectRatio < 1.6;
};

// Get the iPad status
const isPadDevice = isIPad();

// Text sizes for different devices
const textSizes = {
  title: isPadDevice ? 48 : 36,
  titleIntro: isPadDevice ? 64 : 48,
  description: isPadDevice ? 24 : 18,
  descriptionIntro: isPadDevice ? 24 : 18,
  skipText: isPadDevice ? 20 : 16,
  skipButtonText: isPadDevice ? 18 : 14,
  swipeText: isPadDevice ? 20 : 16,
};

// Updated onboarding data with onboarding as last slide
const onboardingData = [
  {
    id: '1',
    image: require('../../assets/onboarding/1.png'),
    title: 'Hi.',
    description:
      'Headphones create invisible walls between us every day. Someone nearby is falling in love with a song you adore. Someone else is rediscovering an old favorite you forgot about. Crescendo makes these musical coincidences visible.',
    isIntro: true,
  },
  {
    id: '2',
    image: require('../../assets/onboarding/2.png'),
    title: "Who's hearing your favorites?",
    description:
      "Convinced your song is a rare treasure? Let's find out if others have already fallen in love with its magic!",
  },
  {
    id: '3',
    image: require('../../assets/onboarding/3.png'),
    title: 'Join Local Sessions',
    description:
      'Join sessions within 5 miles or sessions from your friends, find weekly hits in your community, find your people 👀 in all scattered form!',
  },
  {
    id: '4',
    image: require('../../assets/onboarding/4.png'),
    title: 'Connect with Friends',
    description: 'Find friends who love the same music as you do!',
  },
  {
    id: '5',
    image: require('../../assets/images/crescendo_expo.png'),
    title: 'Ready to Start?',
    description: 'Connect with Spotify to begin your musical journey',
    isOnboarding: true,
  },
];

const OnboardingScreen = ({navigation}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  // Animation values for text animations
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(50)).current;
  const descriptionOpacity = useRef(new Animated.Value(0)).current;
  const descriptionTranslateY = useRef(new Animated.Value(30)).current;

  // Animation values for the continuous downward movement
  const circleAnim1 = useRef(new Animated.Value(0)).current;
  const circleAnim2 = useRef(new Animated.Value(0)).current;
  const circleAnim3 = useRef(new Animated.Value(0)).current;

  // Animation value for balloon floating
  const balloonFloat = useRef(new Animated.Value(0)).current;

  // Animation value for first slide hand
  const handSlideUp = useRef(new Animated.Value(0)).current;

  // Start looping animations when component mounts
  useEffect(() => {
    // Create looping animation for first set of circles
    Animated.loop(
      Animated.timing(circleAnim1, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();

    // Create looping animation for second set of circles with slight delay
    Animated.loop(
      Animated.timing(circleAnim2, {
        toValue: 1,
        duration: 25000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();

    // Create looping animation for third set of circles with another delay
    Animated.loop(
      Animated.timing(circleAnim3, {
        toValue: 1,
        duration: 18000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
  }, [circleAnim1, circleAnim2, circleAnim3]);

  // Start balloon floating animation when reaching last slide
  useEffect(() => {
    if (currentIndex === onboardingData.length - 1) {
      Animated.timing(balloonFloat, {
        toValue: 1,
        duration: 100000, // 2 seconds to float up
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
    } else {
      balloonFloat.setValue(0);
    }
  }, [currentIndex, balloonFloat]);

  // Start animations when component mounts
  useEffect(() => {
    // Start hand slide up animation when on first slide
    if (currentIndex === 0) {
      Animated.timing(handSlideUp, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
    } else {
      handSlideUp.setValue(0);
    }
  }, [currentIndex, handSlideUp]);

  // Create multiple instances of each circle to create the continuous loop effect
  const createLoopingCircles = (animValue, baseStyle, topOffset = 0) => {
    const translateY = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [topOffset, topOffset + height],
    });

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

  // When user swipes, update currentIndex
  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  // Animate text when index changes
  useEffect(() => {
    titleOpacity.setValue(0);
    titleTranslateY.setValue(50);
    descriptionOpacity.setValue(0);
    descriptionTranslateY.setValue(30);

    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.timing(titleTranslateY, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.timing(descriptionOpacity, {
      toValue: 1,
      duration: 800,
      delay: 400,
      useNativeDriver: true,
    }).start();

    Animated.timing(descriptionTranslateY, {
      toValue: 0,
      duration: 800,
      delay: 400,
      useNativeDriver: true,
    }).start();
  }, [
    currentIndex,
    titleOpacity,
    titleTranslateY,
    descriptionOpacity,
    descriptionTranslateY,
  ]);

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  // Handle Spotify onboarding success
  const handleOnboardingSuccess = userData => {
    console.log('User onboarded successfully:', userData);
    navigation.replace('MainTabs');
  };

  // Handle skip
  const handleSkip = () => {
    navigation.replace('MainTabs');
  };

  // Render text item with animations
  const renderItem = ({item, index}) => (
    <View style={styles.textContainer}>
      {/* For the last slide, show only the balloon image, then text and buttons below */}
      {item.isOnboarding ? (
        <>
          <View style={styles.lastSlideBalloonContainer}>
            <Animated.Image
              source={item.image}
              style={[
                styles.lastSlideBalloon,
                {
                  transform: [
                    {scale: 0.7},
                    {
                      translateY: balloonFloat.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -height * 0.15],
                      }),
                    },
                  ],
                },
              ]}
              resizeMode="contain"
            />
          </View>
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: titleOpacity,
                transform: [{translateY: titleTranslateY}],
                textAlign: 'center',
                alignSelf: 'center',
                marginTop: 12,
              },
            ]}>
            {item.title}
          </Animated.Text>
          <Animated.Text
            style={[
              styles.description,
              {
                opacity: descriptionOpacity,
                transform: [{translateY: descriptionTranslateY}],
                textAlign: 'center',
                alignSelf: 'center',
              },
            ]}>
            {item.description}
          </Animated.Text>
          <View style={styles.buttonRowInlineCentered}>
            <SpotifyLoginButton
              onLoginSuccess={handleOnboardingSuccess}
              text="Onboard with Spotify"
            />
            <TouchableOpacity
              onPress={handleSkip}
              style={styles.skipButtonInline}>
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        // All other slides: just the title and description
        <>
          {item.isIntro ? (
            <Animated.Text
              style={[
                styles.titleIntro,
                {
                  opacity: titleOpacity,
                  transform: [{translateY: titleTranslateY}],
                },
              ]}>
              {item.title}
            </Animated.Text>
          ) : (
            <Animated.Text
              style={[
                styles.title,
                {
                  opacity: titleOpacity,
                  transform: [{translateY: titleTranslateY}],
                },
              ]}>
              {item.title}
            </Animated.Text>
          )}
          {item.isIntro ? (
            <Animated.Text
              style={[
                styles.descriptionIntro,
                {
                  opacity: descriptionOpacity,
                  transform: [{translateY: descriptionTranslateY}],
                },
              ]}>
              {item.description}
            </Animated.Text>
          ) : (
            <Animated.Text
              style={[
                styles.description,
                {
                  opacity: descriptionOpacity,
                  transform: [{translateY: descriptionTranslateY}],
                },
              ]}>
              {item.description}
            </Animated.Text>
          )}
        </>
      )}
    </View>
  );

  const Pagination = () => (
    <View style={styles.paginationContainer}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[styles.dot, currentIndex === index && styles.activeDot]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FEF9E6" />

      {/* Background with animated circles */}
      <View style={styles.backgroundContainer}>
        {createLoopingCircles(circleAnim1, styles.mintCircle, -width * 0.2)}
        {createLoopingCircles(circleAnim2, styles.creamCircle, height * 0.05)}
        {createLoopingCircles(circleAnim3, styles.pinkCircle, height * 0.6)}
      </View>

      {/* Text content in upper half */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        style={styles.flatList}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={16}
        onScroll={event => {
          const offsetX = event.nativeEvent.contentOffset.x;
          if (offsetX < currentIndex * width) {
            flatListRef.current?.scrollToIndex({
              index: currentIndex,
              animated: false,
            });
          }
        }}
        scrollEnabled={true}
        bounces={false}
      />

      {/* Pagination dots */}
      <Pagination />

      {/* Image with animation for last slide */}
      {currentIndex !== onboardingData.length - 1 && (
        <View style={styles.imageContainer}>
          <Animated.Image
            source={onboardingData[currentIndex]?.image}
            style={[
              styles.image,
              currentIndex === 0 && {
                transform: [
                  {
                    translateY: handSlideUp.interpolate({
                      inputRange: [0, 1],
                      outputRange: [height * 0.5, 0],
                    }),
                  },
                  {scale: 1.2},
                ],
                opacity: handSlideUp,
              },
            ]}
            resizeMode="contain"
          />
        </View>
      )}

      {/* Swipe indicator - only show if not on onboarding slide */}
      {!onboardingData[currentIndex]?.isOnboarding && (
        <View style={styles.swipeIndicatorContainer}>
          <Text style={styles.swipeText}>Swipe to continue</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9E6',
    alignItems: 'center',
    justifyContent: 'center',
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
  imageContainer: {
    position: 'absolute',
    bottom: -height * 0.1,
    width: width,
    height: height * 0.7,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 1,
    overflow: 'visible',
  },
  image: {
    width: width,
    height: height * 0.7,
  },
  introImage: {
    transform: [{scale: 1.2}],
  },
  flatList: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  slideContainer: {
    width: width,
    flex: 1,
  },
  textContainer: {
    width: width,
    paddingHorizontal: 30,
    paddingTop: STATUSBAR_HEIGHT + 40,
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: 'bold',
    fontSize: textSizes.title,
    marginBottom: 20,
    color: '#4c3d3f',
    alignSelf: 'flex-start',
  },
  titleIntro: {
    fontWeight: '900',
    fontSize: textSizes.titleIntro,
    marginBottom: 15,
    marginTop: 20,
    color: '#4c3d3f',
    alignSelf: 'flex-start',
  },
  description: {
    fontSize: textSizes.description,
    color: '#4c3d3f',
    textAlign: 'left',
    lineHeight: isPadDevice ? 32 : 26,
    paddingVertical: 8,
  },
  descriptionIntro: {
    fontSize: textSizes.descriptionIntro,
    fontWeight: '500',
    color: '#4c3d3f',
    textAlign: 'left',
    lineHeight: isPadDevice ? 32 : 26,
    paddingVertical: 8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: height * 0.08,
    width: width,
    zIndex: 2,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#F3904F55',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#F3904F',
    width: 20,
  },
  skipButton: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 10,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    color: '#4c3d3f',
    fontSize: textSizes.skipText,
    fontWeight: '600',
  },
  swipeIndicatorContainer: {
    position: 'absolute',
    bottom: height * 0.05,
    alignItems: 'center',
    zIndex: 3,
  },
  swipeText: {
    color: '#4c3d3f',
    fontSize: textSizes.swipeText,
    fontWeight: '500',
  },
  buttonRowInline: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
  },
  skipButtonInline: {
    padding: 10,
    marginLeft: 16,
  },
  skipButtonText: {
    color: '#4c3d3f',
    fontSize: textSizes.skipButtonText,
    fontWeight: '500',
  },
  buttonRowInlineCentered: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  lastSlideBalloonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  lastSlideBalloon: {
    width: width * 0.7,
    height: height * 0.3,
  },
});

export default OnboardingScreen;
