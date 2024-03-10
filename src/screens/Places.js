import React, { useState, useCallback, useEffect } from 'react';
import {
  View, FlatList, Text, TouchableOpacity, RefreshControl, StyleSheet, Button, ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getViewablePlaces, selectPlace } from '../redux/placesSlice';

function Places({ navigation }) {
  const dispatch = useDispatch();
  const {
    // eslint-disable-next-line no-unused-vars
    places, selectedPlace, status, error,
  } = useSelector((state) => state.places);
  const { user } = useSelector((state) => state.user);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedIds, setExpandedIds] = useState([]);

  useEffect(() => {
    dispatch(getViewablePlaces(user._id));
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      dispatch(getViewablePlaces(user._id));
    } catch (err) {
      console.error('Error refreshing places:', err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const preparePlacesData = () => {
    const discoveredPlaces = places.filter((place) => place.discoveredBy.some((d) => d.user._id === user._id));
    const undiscoveredPlaces = places.filter((place) => !place.discoveredBy.some((d) => d.user._id === user._id));

    return [
      { _id: 'discovered_header', type: 'header', title: 'Discovered Places' },
      ...discoveredPlaces,
      { _id: 'undiscovered_header', type: 'header', title: 'Undiscovered Places' },
      ...undiscoveredPlaces,
    ];
  };

  const toggleExpandPlaceCard = (placeId) => {
    setExpandedIds((currentIds) => (currentIds.includes(placeId) ? currentIds.filter((id) => id !== placeId) : [...currentIds, placeId]));
  };

  const renderPlaceCard = ({ item }) => {
    if (item.type === 'header') {
      return <Text style={styles.header}>{item.title}</Text>;
    } else {
      const isDiscovered = item.discoveredBy.some((discoverer) => discoverer.user._id === user._id);
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
              <Text>{new Date(discovery.discoveredDate).toLocaleDateString()}</Text>
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
    }
  };

  if (places) {
    return (
      <View style={styles.container}>
        <FlatList
          data={preparePlacesData()}
          renderItem={renderPlaceCard}
          keyExtractor={(item) => item._id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>Fetching places...</Text>
        <ActivityIndicator />
      </View>
    );
  }
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
