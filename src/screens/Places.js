import React, { useState, useCallback } from 'react';
import {
  View, FlatList, ActivityIndicator, Text, TouchableOpacity, RefreshControl, StyleSheet, Button,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getViewablePlaces, selectPlace } from '../redux/placesSlice';

function Places({ navigation }) {
  const dispatch = useDispatch();
  const {
    // eslint-disable-next-line no-unused-vars
    places, selectedPlace, status, error,
  } = useSelector((state) => state.places);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedIds, setExpandedIds] = useState([]);
  const userId = '65ea4d67b018e631a0b4003f';

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(getViewablePlaces('65ea4d67b018e631a0b4003f'));
    } catch (err) {
      console.error('Error refreshing places:', err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // const data = preparePlacesData(places, userId);

  const handleSelectPlace = (place) => {
    dispatch(selectPlace(place));
    navigation.navigate('Home');
    console.log('Selected place:', selectedPlace);
  };

  const toggleExpandPlaceCard = (placeId) => {
    setExpandedIds((currentIds) => (currentIds.includes(placeId) ? currentIds.filter((id) => id !== placeId) : [...currentIds, placeId]));
  };

  const renderPlaceCard = ({ item }) => {
    const isDiscovered = item.discoveredBy.some((discoverer) => discoverer.user._id === userId);
    const isExpanded = expandedIds.includes(item._id);

    return (
      <TouchableOpacity
        onPress={() => toggleExpandPlaceCard(item._id)}
        style={styles.card}
      >
        <Text style={styles.title}>{isDiscovered ? item.name : '???'}</Text>
        {isExpanded && isDiscovered && item.discoveredBy.map((discovery, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <View key={index} style={styles.discoveryDetail}>
            <Text>{discovery.user.username}</Text>
            <Text>{new Date(discovery.discoveredAt).toLocaleDateString()}</Text>
          </View>
        ))}
        <Button
          title="Navigate"
          onPress={() => {
            dispatch(selectPlace(item));
            navigation.navigate('Home');
          }}
        />
      </TouchableOpacity>
    );
  };

  const discoveredPlaces = places.filter((place) => place.discoveredBy.some((d) => d.user._id === userId));
  const undiscoveredPlaces = places.filter((place) => !place.discoveredBy.some((d) => d.user._id === userId));

  return (
    <View style={styles.container}>
      <FlatList
        data={discoveredPlaces}
        renderItem={renderPlaceCard}
        keyExtractor={(item) => item._id.toString()}
        ListHeaderComponent={<Text style={styles.header}>Discovered Places</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <FlatList
        data={undiscoveredPlaces}
        renderItem={renderPlaceCard}
        keyExtractor={(item) => item._id.toString()}
        ListHeaderComponent={<Text style={styles.header}>Undiscovered Places</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 10,
    padding: 20,
    backgroundColor: 'lightgray',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  discoveryDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingTop: 20,
    paddingLeft: 10,
  },
});

export default Places;
