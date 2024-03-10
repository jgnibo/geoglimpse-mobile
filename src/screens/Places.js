import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, RefreshControl, StyleSheet, ActivityIndicator,
} from 'react-native';
import {
  Accordion, AccordionItem,
  AccordionHeader, AccordionTrigger, AccordionContent,
  AccordionIcon, AccordionTitleText, AccordionContentText,
  ChevronDownIcon, ChevronUpIcon, Button, ButtonText,
} from '@gluestack-ui/themed';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { getViewablePlaces, selectPlace } from '../redux/placesSlice';

function Places({ navigation }) {
  const dispatch = useDispatch();
  const {
    // eslint-disable-next-line no-unused-vars
    places, selectedPlace, status, error,
  } = useSelector((state) => state.places);
  const { user } = useSelector((state) => state.user);
  const [refreshing, setRefreshing] = useState(false);
  // const [expandedIds, setExpandedIds] = useState([]);

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

  const placesData = preparePlacesData();

  // const toggleExpandPlaceCard = (placeId) => {
  //   setExpandedIds((currentIds) => (currentIds.includes(placeId) ? currentIds.filter((id) => id !== placeId) : [...currentIds, placeId]));
  // };

  // const renderPlaceCard = ({ item }) => {
  //   if (item.type === 'header') {
  //     return <Text style={styles.header}>{item.title}</Text>;
  //   } else {
  //     const isDiscovered = item.discoveredBy.some((discoverer) => discoverer.user._id === user._id);
  //     const isExpanded = expandedIds.includes(item._id);

  //     return (
  //       <TouchableOpacity
  //         onPress={() => toggleExpandPlaceCard(item._id)}
  //         style={styles.card}
  //       >
  //         <Text style={styles.title}>{isDiscovered ? item.name : '???'}</Text>
  //         {isExpanded && isDiscovered && item.discoveredBy.map((discovery, index) => (
  //           // eslint-disable-next-line react/no-array-index-key
  //           <View key={index} style={styles.discoveryDetail}>
  //             <Text>{discovery.user.username}</Text>
  //             <Text>{new Date(discovery.discoveredDate).toLocaleDateString()}</Text>
  //           </View>
  //         ))}
  //         <Button
  //           title="Navigate"
  //           onPress={() => {
  //             dispatch(selectPlace(item));
  //             navigation.navigate('Home');
  //           }}
  //         />
  //       </TouchableOpacity>
  //     );
  //   }
  // };

  const renderAccordionPlaceCard = ({ item }) => {
    if (item.type === 'header') {
      return <Text style={styles.header}>{item.title}</Text>;
    } else {
      const isDiscovered = item.discoveredBy.some((discoverer) => discoverer.user._id === user._id);
      // const expanded = expandedIds.includes(item._id);

      return (
        <AccordionItem value={item._id} key={item._id}>
          <AccordionHeader>
            <AccordionTrigger>
              {({ isExpanded }) => {
                return (
                  <>

                    <AccordionTitleText
                      style={{ fontSize: 20, fontWeight: 600, marginBottom: -10 }}
                    >
                      {isDiscovered ? item.name : '???'}
                    </AccordionTitleText>
                    {isExpanded ? (
                      <AccordionIcon as={ChevronUpIcon} ml="$3" />
                    ) : (
                      <AccordionIcon as={ChevronDownIcon} ml="$3" />
                    )}
                  </>
                );
              }}
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>

            <AccordionContentText
              style={{ marginTop: -10 }}
            >
              {item.discoveredBy.map((discovery) => `- Discovered by ${discovery.user.username} on ${new Date(discovery.discoveredDate).toLocaleDateString()}`).join('\n')}
            </AccordionContentText>
            {/*
            {expanded && isDiscovered && item.discoveredBy.map((discovery, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <>
                <AccordionContentText>{discovery.user.username}</AccordionContentText>
                <AccordionContentText>{new Date(discovery.discoveredDate).toLocaleDateString()}</AccordionContentText>
              </>
            ))} */}
            <Button
              style={{ marginTop: 10 }}
              onPress={() => {
                dispatch(selectPlace(item));
                navigation.navigate('Home');
              }}
            >
              <ButtonText>Navigate Here</ButtonText>
            </Button>

          </AccordionContent>
        </AccordionItem>
      );
    }
  };

  if (places) {
    return (
      <View style={styles.container}>
        {/* <FlatList
          data={preparePlacesData()}
          renderItem={renderPlaceCard}
          keyExtractor={(item) => item._id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        /> */}

        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Accordion
            width="100%"
            type="multiple"
            shadowColor="transparent"
            variant="unfilled"
          >
            {placesData.map((place) => renderAccordionPlaceCard({ item: place }))}
          </Accordion>

        </ScrollView>

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
    color: '#488dfd',
  },
});

export default Places;
