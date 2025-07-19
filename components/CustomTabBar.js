import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Animated,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

export default function CustomTabBar({ state, descriptors, navigation }) {
  // Clean tab configuration
  const tabs = [
    { 
      icon: 'home',
      component: Ionicons 
    },
    { 
      icon: 'grid-view', 
      component: MaterialIcons 
    },
    { 
      icon: 'person',
      component: Ionicons 
    }
  ];

  const activeIndex = state.index;
  const [previousIndex, setPreviousIndex] = useState(activeIndex);

  // Animation refs
  const ballAnim = useRef(new Animated.Value(activeIndex)).current;
  const scaleAnims = useRef(tabs.map(() => new Animated.Value(1))).current;
  const ballScale = useRef(new Animated.Value(1)).current;
  const ballOpacity = useRef(new Animated.Value(1)).current;

  // Initialize ball position
  useEffect(() => {
    if (activeIndex !== previousIndex) {
      // Animate ball from previous position to new position
      Animated.sequence([
        // Scale up slightly at start
        Animated.timing(ballScale, {
          toValue: 1.3,
          duration: 100,
          useNativeDriver: true,
        }),
        // Move to new position with easing
        Animated.parallel([
          Animated.timing(ballAnim, {
            toValue: activeIndex,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(ballScale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      setPreviousIndex(activeIndex);
    }
  }, [activeIndex, previousIndex]);

  const handleTabPress = (index) => {
    const route = state.routes[index];
    const isFocused = state.index === index;

    // Subtle press animation for the icon
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[index], {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();

    // Ball animation sequence
    if (index !== activeIndex) {
      Animated.sequence([
        // Scale up and prepare for movement
        Animated.timing(ballScale, {
          toValue: 1.3,
          duration: 100,
          useNativeDriver: true,
        }),
        // Move to new position
        Animated.parallel([
          Animated.timing(ballAnim, {
            toValue: index,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(ballScale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      setPreviousIndex(index);
    }

    // Navigate using tab navigator
    if (!isFocused) {
      navigation.navigate(route.name);
    }
  };

  // Calculate ball position - moves to center of each tab
  const ballTranslateX = ballAnim.interpolate({
    inputRange: tabs.map((_, index) => index),
    outputRange: tabs.map((_, index) => {
      const tabWidth = (width - 80) / tabs.length; // 40px margin on each side
      return index * tabWidth + tabWidth / 2 - 4; // 4 is half of ball width (8px)
    }),
  });

  return (
    <View style={styles.bottomNav}>
      {/* Animated moving ball */}
      <Animated.View
        style={[
          styles.movingBall,
          {
            transform: [
              { translateX: ballTranslateX },
              { scale: ballScale }
            ],
            opacity: ballOpacity,
          },
        ]}
      />

      {/* Tab buttons */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          const IconComponent = tab.component;
          
          return (
            <TouchableOpacity
              key={index}
              style={styles.tab}
              onPress={() => handleTabPress(index)}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.iconContainer,
                  {
                    transform: [{ scale: scaleAnims[index] }],
                  },
                ]}
              >
                <IconComponent
                  name={tab.icon}
                  size={24}
                  color={isActive ? '#d24242' : '#666'}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: 40,
    right: 40,
    height: 60,
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  movingBall: {
    position: 'absolute',
    top: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d24242',
    shadowColor: '#d24242',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  tabsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});