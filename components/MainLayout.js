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
import { useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function MainLayout({ children, navigation }) {
  const route = useRoute();
  const currentRoute = route.name;

  // Clean tab configuration
  const tabs = [
    { 
      icon: 'home',
      route: 'Main',
      component: Ionicons 
    },
    { 
      icon: 'grid-view', 
      route: 'category',
      component: MaterialIcons 
    },
    { 
      icon: 'person',
      route: 'Profile',
      component: Ionicons 
    }
  ];

  // Define which routes belong to which tab
  const routeToTabMapping = {
    'Main': 0,
    'category': 1,
    'CategoryListScreen': 1, // Category tab should stay active
    'LieuListScreen': 1,     // Category tab should stay active
    'LieuDetailsScreen': 1,  // Category tab should stay active
    'Profile': 2,
  };

  // Get the active index based on current route, with fallback logic
  const getActiveIndex = () => {
    if (routeToTabMapping.hasOwnProperty(currentRoute)) {
      return routeToTabMapping[currentRoute];
    }
    // Default to category tab for unknown routes (assuming they're part of category flow)
    return 1;
  };

  const activeIndex = getActiveIndex();
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

  const handleTabPress = (tab, index) => {
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

    // Navigate - only navigate if clicking on a different tab
    if (tab.route !== currentRoute && navigation) {
      // For category tab, navigate to CategoryListScreen instead of 'category'
      if (tab.route === 'category') {
        navigation.navigate('CategoryListScreen');
      } else {
        navigation.navigate(tab.route);
      }
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
    <View style={styles.container}>
      {/* Main content */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Clean Bottom Navigation */}
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
                onPress={() => handleTabPress(tab, index)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  content: {
    flex: 1,
  },
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