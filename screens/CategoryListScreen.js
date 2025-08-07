import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  ImageBackground,
  Animated,
  TextInput,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import MainLayout from '../components/MainLayout';
import API_URL from '../config/api';

const { width, height } = Dimensions.get('window');

export default function CategoryListScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [favorites, setFavorites] = useState([]); // Still needed for toggleFavorite function, even if not displayed
  const [showSearch, setShowSearch] = useState(false);
  
  // Enhanced Animations
  const scrollY = useRef(new Animated.Value(0)).current;
  const searchAnimation = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const cardAnimations = useRef([]).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  // Luxury pulse effect
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    // Shimmer effect
    const shimmer = Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );
    shimmer.start();

    return () => {
      pulse.stop();
      shimmer.stop();
    };
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/categories`, {
        headers: {
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        const enhancedData = data.map((item, index) => ({
          ...item,
          popularity: Math.floor(Math.random() * 100) + 1,
          eventCount: Math.floor(Math.random() * 50) + 5,
          rating: (Math.random() * 2 + 3).toFixed(1),
          distance: `${(Math.random() * 10 + 0.5).toFixed(1)}km`,
          nextEvent: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
          priceRange: ['$', '$$', '$$$', '$$$$'][Math.floor(Math.random() * 4)],
          backgroundImage: require('../assets/events.jpg'),
        }));
        setCategories(enhancedData);
        
        // Enhanced staggered animations
        cardAnimations.length = 0;
        enhancedData.forEach((_, index) => {
          cardAnimations[index] = new Animated.Value(0);
        });
        
        Animated.stagger(150, 
          cardAnimations.map((anim, index) => 
            Animated.spring(anim, {
              toValue: 1,
              useNativeDriver: true,
              tension: 40,
              friction: 7,
              delay: index * 50,
            })
          )
        ).start();
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    Animated.spring(searchAnimation, {
      toValue: showSearch ? 0 : 1,
      useNativeDriver: true,
      tension: 80,
      friction: 6,
    }).start();
  };

  const toggleFavorite = (categoryId) => {
    setFavorites(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getCategoryEmoji = (categoryName) => {
    const name = categoryName.toLowerCase();
    const emojiMap = {
      'music': '🎼', 'party': '🥂', 'sport': '🏆', 'food': '🍾',
      'art': '🎨', 'night': '🌟', 'outdoor': '🌿', 'gaming': '🎮',
      'dance': '💃', 'concert': '🎭', 'festival': '🎪', 'club': '✨',
      'restaurant': '🍽️', 'bar': '🥃', 'cinema': '🎬', 'theater': '🎭'
    };
    
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (name.includes(key)) return emoji;
    }
    return '💎';
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

const renderFullWidthCard = ({ item, index }) => {
  const animatedStyle = {
    opacity: cardAnimations[index] || 1,
    transform: [
      {
        translateY: cardAnimations[index] ? cardAnimations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }) : 0,
      },
      {
        scale: cardAnimations[index] ? cardAnimations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
        }) : 1,
      },
    ],
  };

  return (
    <Animated.View style={[styles.fullWidthCard, animatedStyle]}>
      <TouchableOpacity
        onPress={() => navigation.navigate('LieuListScreen', { categoryId: item.id })}
        activeOpacity={0.85}
      >
        <View style={styles.cardContainer}>
          <ImageBackground
            source={item.image || require('../assets/events.jpg')}
            style={styles.fullWidthImage}
            imageStyle={styles.backgroundImageStyle}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
              locations={[0, 0.4, 1]}
              style={styles.imageOverlay}
            >
              {/* Only the category title, centered */}
              <Text style={styles.categoryTitleCentered}>{item.name}</Text>
            </LinearGradient>
            
            <Animated.View 
              style={[
                styles.shimmerOverlay,
                {
                  opacity: shimmerAnimation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0.2, 0],
                  }),
                  transform: [{
                    translateX: shimmerAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-width, width],
                    }),
                  }],
                }
              ]}
            />
          </ImageBackground>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

  if (loading) {
    return (
      <MainLayout navigation={navigation}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#141414" />
          <View style={styles.loadingContainer}>
            <LinearGradient
              colors={['#d24242', '#ff6b6b']}
              style={styles.loadingGradient}
            >
              <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
                <ActivityIndicator size="large" color="#ffffff" />
              </Animated.View>
              <Text style={styles.loadingText}>Loading epic categories... 🚀</Text>
              <Text style={styles.loadingSubtext}>Preparing your next adventure!</Text>
            </LinearGradient>
          </View>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout navigation={navigation}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#141414" />
        
        {/* Enhanced Header */}
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <LinearGradient
            colors={['rgba(20,20,20,0.95)', 'rgba(20,20,20,0.8)', 'transparent']}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.headerTitle}>Discover 🎊</Text>
                <Text style={styles.headerSubtitle}>
                  {filteredCategories.length} categories available
                </Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerButton} onPress={toggleSearch}>
                  <LinearGradient
                    colors={['#2a2a2a', '#1a1a1a']}
                    style={styles.headerButtonGradient}
                  >
                    <Ionicons name="search" size={24} color="#E4E4E4" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Enhanced Search Bar */}
        <Animated.View style={[
          styles.searchContainer,
          {
            opacity: searchAnimation,
            transform: [{
              translateY: searchAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            }],
          }
        ]}>
          <BlurView intensity={20} style={styles.searchBlur}>
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.searchGradient}
            >
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#999" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search categories..."
                  placeholderTextColor="#999"
                  value={searchText}
                  onChangeText={setSearchText}
                />
                {searchText.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchText('')}>
                    <Ionicons name="close-circle" size={20} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
            </LinearGradient>
          </BlurView>
        </Animated.View>

        {/* Categories List */}
        {filteredCategories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <LinearGradient
              colors={['#2a2a2a', '#1a1a1a']}
              style={styles.emptyGradient}
            >
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>No Categories Found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search to discover amazing experiences!
              </Text>
              <TouchableOpacity 
                style={styles.clearFiltersButton}
                onPress={() => setSearchText('')}
              >
                <LinearGradient
                  colors={['#d24242', '#ff6b6b']}
                  style={styles.clearFiltersGradient}
                >
                  <Text style={styles.clearFiltersText}>Clear Search</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ) : (
          <Animated.FlatList
            data={filteredCategories}
            renderItem={renderFullWidthCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            numColumns={1}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { 
                useNativeDriver: false,
                listener: (event) => {
                  const offsetY = event.nativeEvent.contentOffset.y;
                  const opacity = offsetY > 50 ? 0.8 : 1;
                  headerOpacity.setValue(opacity);
                }
              }
            )}
            scrollEventThrottle={16}
          />
        )}
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#141414',
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerGradient: {
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E4E4E4',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  headerButtonGradient: {
    padding: 12,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBlur: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  searchGradient: {
    borderRadius: 25,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  listContainer: {
    paddingTop: 0,
    paddingBottom: 120,
  },
  fullWidthCard: {
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  cardContainer: {
    overflow: 'hidden',
  },
  fullWidthImage: {
    width: '100%',
    height: 220,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  backgroundImageStyle: {
    // No border radius for rectangular cards
  },
  imageOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 100,
  },
  categoryTitleCentered: { // New style for centered title
    color: '#ffffff',
    fontSize: 32, // Increased font size for prominence
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Add text shadow for readability
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingGradient: {
    borderRadius: 25,
    padding: 40,
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyGradient: {
    borderRadius: 25,
    padding: 40,
    alignItems: 'center',
    width: '100%',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#E4E4E4',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  clearFiltersButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  clearFiltersGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  clearFiltersText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});