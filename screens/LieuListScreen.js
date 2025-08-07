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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import MainLayout from '../components/MainLayout';
import API_URL from '../config/api';

const { width, height } = Dimensions.get('window');

export default function LieuListScreen({ route, navigation }) {
  const { categoryId } = route.params;
  const [lieux, setLieux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [favorites, setFavorites] = useState([]);
  
  // Animations
  const scrollY = useRef(new Animated.Value(0)).current;
  const searchAnimation = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const cardAnimations = useRef([]).current;
  const shimmerAnimation = useRef(new Animated.Value(0)).current; // Added shimmer animation

  // Shimmer effect for cards
  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );
    shimmer.start();

    return () => {
      shimmer.stop();
    };
  }, []);

  const fetchLieux = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/lieux/by-category/${categoryId}`, {
        headers: {
          'Accept': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Add mock data for enhanced features
        const enhancedData = data.map((item, index) => ({
          ...item,
          rating: (Math.random() * 2 + 3).toFixed(1),
          distance: `${(Math.random() * 10 + 0.5).toFixed(1)}km`,
          isOpen: Math.random() > 0.3,
          priceRange: ['€', '€€', '€€€'][Math.floor(Math.random() * 3)],
          backgroundImage: require('../assets/events.jpg'), // Use your image
        }));
        setLieux(enhancedData);
        
        // Initialize card animations
        cardAnimations.length = 0;
        enhancedData.forEach((_, index) => {
          cardAnimations[index] = new Animated.Value(0);
        });
        
        // Stagger card animations
        Animated.stagger(150, // Increased stagger delay
          cardAnimations.map(anim => 
            Animated.spring(anim, {
              toValue: 1,
              useNativeDriver: true,
              tension: 40, // Adjusted tension
              friction: 7, // Adjusted friction
            })
          )
        ).start();
      } else {
        console.error(`Error ${response.status} loading places`);
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLieux();
  }, []);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    Animated.spring(searchAnimation, {
      toValue: showSearch ? 0 : 1,
      useNativeDriver: true,
      tension: 80, // Adjusted tension
      friction: 6, // Adjusted friction
    }).start();
  };

  const toggleFavorite = (lieuId) => {
    setFavorites(prev => 
      prev.includes(lieuId) 
        ? prev.filter(id => id !== lieuId)
        : [...prev, lieuId]
    );
  };

  const filteredLieux = lieux.filter(lieu => 
    lieu.nom.toLowerCase().includes(searchText.toLowerCase()) ||
    lieu.adresse.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderLieu = ({ item, index }) => {
    const animatedStyle = {
      opacity: cardAnimations[index] || 1,
      transform: [
        {
          translateY: cardAnimations[index] ? cardAnimations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [80, 0], // Increased translateY for more dramatic entrance
          }) : 0,
        },
        {
          scale: cardAnimations[index] ? cardAnimations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.9, 1], // Adjusted scale for bigger initial state
          }) : 1,
        },
      ],
    };

    return (
      <Animated.View style={[styles.lieuCard, animatedStyle]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('LieuDetailsScreen', { lieuId: item.id })}
          activeOpacity={0.85} // Adjusted activeOpacity
        >
          <View style={styles.cardContainer}>
            <ImageBackground
              source={item.backgroundImage || require('../assets/events.jpg')}
              style={styles.lieuImage}
              imageStyle={styles.backgroundImageStyle}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']} // Darker gradient
                locations={[0, 0.4, 1]}
                style={styles.imageOverlay}
              >
                <View style={styles.lieuHeader}>
                  <View style={styles.statusBadge}>
                    <View style={[styles.statusDot, { backgroundColor: item.isOpen ? '#00e676' : '#ff1744' }]} />
                    <Text style={styles.statusText}>{item.isOpen ? 'Open Now' : 'Closed'}</Text> {/* More descriptive text */}
                  </View>
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(item.id)}
                  >
                    <LinearGradient // Added gradient to favorite button
                      colors={favorites.includes(item.id) ? ['#ff1744', '#d50000'] : ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                      style={styles.favoriteGradient}
                    >
                      <Ionicons
                        name={favorites.includes(item.id) ? "heart" : "heart-outline"}
                        size={24} // Increased icon size
                        color="#ffffff"
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <View style={styles.lieuFooter}>
                  <Text style={styles.lieuNom}>{item.nom}</Text>
                  <Text style={styles.lieuAdresse}>{item.adresse}</Text>
                  
                  <View style={styles.lieuStats}>
                    <View style={styles.statItem}>
                      <Ionicons name="star" size={16} color="#ffd700" /> {/* Increased icon size */}
                      <Text style={styles.statText}>{item.rating}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="location-outline" size={16} color="rgba(255,255,255,0.7)" /> {/* Changed icon, increased size */}
                      <Text style={styles.statText}>{item.distance}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.priceText}>{item.priceRange}</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
              {/* Shimmer Overlay */}
              <Animated.View 
                style={[
                  styles.shimmerOverlay,
                  {
                    opacity: shimmerAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 0.3, 0],
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
          <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" /> {/* Darker status bar */}
          <View style={styles.loadingContainer}>
            <LinearGradient
              colors={['#d24242', '#ff6b6b']}
              style={styles.loadingGradient}
            >
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Curating Elite Destinations... 🗺️</Text> {/* More luxurious text */}
              <Text style={styles.loadingSubtext}>Unveiling the finest experiences for you!</Text> {/* More luxurious text */}
            </LinearGradient>
          </View>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout navigation={navigation}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
        
        {/* Animated Header */}
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <LinearGradient // Added gradient to header
            colors={['rgba(10,10,10,0.95)', 'rgba(10,10,10,0.8)', 'transparent']}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.headerTitle}>Elite Places 🌟</Text> {/* More luxurious title */}
                <Text style={styles.headerSubtitle}>
                  {filteredLieux.length} exclusive venues discovered
                </Text> {/* More luxurious subtitle */}
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerButton} onPress={toggleSearch}>
                  <LinearGradient // Added gradient to header buttons
                    colors={['#2a2a2a', '#1a1a1a']}
                    style={styles.headerButtonGradient}
                  >
                    <Ionicons name="search" size={24} color="#E4E4E4" />
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.headerButton}
                  onPress={() => navigation.goBack()}
                >
                  <LinearGradient // Added gradient to header buttons
                    colors={['#2a2a2a', '#1a1a1a']}
                    style={styles.headerButtonGradient}
                  >
                    <Ionicons name="arrow-back" size={24} color="#E4E4E4" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Search Bar */}
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
          <BlurView intensity={30} style={styles.searchBlur}> {/* Increased blur intensity */}
            <LinearGradient // Added gradient to search input
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.searchGradient}
            >
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#999" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search elite venues..." // More luxurious placeholder
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

        {/* Places List */}
        {filteredLieux.length === 0 ? (
          <View style={styles.emptyContainer}>
            <LinearGradient
              colors={['#2a2a2a', '#1a1a1a']}
              style={styles.emptyGradient}
            >
              <Text style={styles.emptyEmoji}>🏢</Text>
              <Text style={styles.emptyTitle}>No Elite Venues Found</Text> {/* More luxurious text */}
              <Text style={styles.emptySubtitle}>
                Refine your search to uncover hidden gems and exclusive spots.
              </Text> {/* More luxurious text */}
              <TouchableOpacity 
                style={styles.clearSearchButton}
                onPress={() => setSearchText('')}
              >
                <LinearGradient
                  colors={['#d24242', '#ff6b6b']}
                  style={styles.clearSearchGradient}
                >
                  <Text style={styles.clearSearchText}>Clear Search</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ) : (
          <Animated.FlatList
            data={filteredLieux}
            renderItem={renderLieu}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            numColumns={1} // Changed to 1 column for bigger cards
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { 
                useNativeDriver: false,
                listener: (event) => {
                  const offsetY = event.nativeEvent.contentOffset.y;
                  const opacity = offsetY > 50 ? 0.9 : 1; // Adjusted opacity change
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
    backgroundColor: '#0A0A0A', // Darker background
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerGradient: { // New style for header gradient
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 0, // No border radius for header
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 34, // Bigger title
    fontWeight: '800', // Bolder font
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.5, // Tighter letter spacing
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#B0B0B0', // Lighter grey
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  headerButtonGradient: { // New style for header button gradient
    padding: 12,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBlur: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  searchGradient: { // New style for search gradient
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
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120,
  },
  lieuCard: {
    width: '100%', // Full width
    marginBottom: 24, // Increased margin bottom
    borderRadius: 25, // Maintained rounded corners for cards
    overflow: 'hidden',
    elevation: 15, // Increased elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 }, // Bigger shadow offset
    shadowOpacity: 0.5, // More opaque shadow
    shadowRadius: 12, // Larger shadow radius
  },
  cardContainer: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  lieuImage: {
    width: '100%',
    height: 250, // Increased height for bigger cards
    justifyContent: 'space-between',
  },
  backgroundImageStyle: {
    borderRadius: 25,
  },
  imageOverlay: {
    flex: 1,
    padding: 20, // Increased padding
    justifyContent: 'space-between',
  },
  shimmerOverlay: { // New style for shimmer effect
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 100,
  },
  lieuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker background
    borderRadius: 15, // More rounded
    paddingHorizontal: 10, // Increased padding
    paddingVertical: 6, // Increased padding
    gap: 8, // Increased gap
  },
  statusDot: {
    width: 10, // Bigger dot
    height: 10, // Bigger dot
    borderRadius: 5,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12, // Slightly larger font
    fontWeight: 'bold',
  },
  favoriteButton: {
    borderRadius: 25, // More rounded
    overflow: 'hidden',
  },
  favoriteGradient: { // New style for favorite button gradient
    width: 50, // Bigger button
    height: 50, // Bigger button
    justifyContent: 'center',
    alignItems: 'center',
  },
  lieuFooter: {
    alignItems: 'flex-start',
  },
  lieuNom: {
    color: '#ffffff',
    fontSize: 22, // Bigger font size
    fontWeight: '800', // Bolder font
    marginBottom: 6, // Increased margin
    letterSpacing: -0.3, // Tighter letter spacing
  },
  lieuAdresse: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14, // Slightly larger font
    marginBottom: 12, // Increased margin
    fontWeight: '500',
  },
  lieuStats: {
    flexDirection: 'row',
    gap: 20, // Increased gap
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // Increased gap
  },
  statText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12, // Slightly larger font
    fontWeight: '600',
  },
  priceText: {
    color: '#00e676',
    fontSize: 14, // Slightly larger font
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingGradient: {
    borderRadius: 30, // More rounded
    padding: 50, // Increased padding
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 20, // Increased margin
    fontSize: 20, // Bigger font
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  loadingSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 10, // Increased margin
    fontSize: 16, // Bigger font
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyGradient: {
    borderRadius: 30, // More rounded
    padding: 50, // Increased padding
    alignItems: 'center',
    width: '100%',
  },
  emptyEmoji: {
    fontSize: 80, // Bigger emoji
    marginBottom: 25, // Increased margin
  },
  emptyTitle: {
    fontSize: 26, // Bigger font
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 15, // Increased margin
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 17, // Bigger font
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 26, // Increased line height
    marginBottom: 35, // Increased margin
    fontWeight: '500',
  },
  clearSearchButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  clearSearchGradient: {
    paddingHorizontal: 30, // Increased padding
    paddingVertical: 15, // Increased padding
  },
  clearSearchText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});