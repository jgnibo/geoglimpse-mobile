import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View, Text, StyleSheet, Image, Modal,
} from 'react-native';

import {
  SafeAreaView, Fab, FabLabel, AddIcon, FabIcon, Button, ButtonText,
} from '@gluestack-ui/themed';
import { getRhumbLineBearing, getDistance } from 'geolib';
import * as Location from 'expo-location';
import { discoverPlace } from '../redux/placesSlice';

import Arrow from '../assets/arrow.png';

function Compass({ navigation }) {
  // const [heading, setHeading] = useState(null);
  const [angle, setAngle] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [distance, setDistance] = useState(9999);
  const [isWithinRange, setIsWithinRange] = useState(false);

  const dispatch = useDispatch();
  const { places, selectedPlace } = useSelector((state) => state.places);

  const { user } = useSelector((state) => state.user);
  const { longitude, latitude } = useSelector((state) => state.location);

  // Subscribe to device heading and handle compass angle updates
  useEffect(() => {
    let headingSubscription;
    (async () => {
      headingSubscription = await Location.watchHeadingAsync((newHeading) => {
        // setHeading(newHeading);

        if (longitude && latitude && selectedPlace) {
          const idealBearing = getRhumbLineBearing(
            { latitude, longitude },
            { latitude: selectedPlace.location.coordinates[1], longitude: selectedPlace.location.coordinates[0] },
          );

          const newAngle = idealBearing - newHeading.trueHeading;

          setAngle((newAngle + 360) % 360); // Normalize angle between 0 and 360
        }
      });
    })();
    return () => {
      // eslint-disable-next-line no-unused-expressions
      headingSubscription && headingSubscription.remove();
    };
  }, [longitude, latitude, selectedPlace]);

  // Calculate distance to target, handle modal display

  const handleModalClose = () => {
    setModalVisible(false);
    const visitedBefore = selectedPlace.discoveredBy.some((d) => d.user._id === user._id);
    if (!visitedBefore) {
      dispatch(discoverPlace({ placeId: selectedPlace._id, userId: user._id }));
    }
  };

  useEffect(() => {
    if (longitude && latitude && selectedPlace) {
      const computedDistance = getDistance(
        { latitude, longitude },
        { latitude: selectedPlace.location.coordinates[1], longitude: selectedPlace.location.coordinates[0] },
      );

      setDistance(computedDistance);

      // 6 meters is the approximate radius of each hexagon tile. From a UI perspective, it would look weird if a place was unlocked but the tile wasn't "explored." So ideally the user is within the tile when the explore a place
      if (computedDistance < 6) {
        if (!isWithinRange) {
          setIsWithinRange(true);
          setModalVisible(true);
        }
      } else if (isWithinRange) {
        setIsWithinRange(false);
      }
    }
  }, [longitude, latitude, selectedPlace, dispatch, isWithinRange]);

  const renderCompass = () => {
    if (selectedPlace) {
      const isDiscovered = selectedPlace.discoveredBy.some((discoverer) => discoverer.user._id === user._id);

      if (isDiscovered) {
        return (
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            {`Navigating to ${selectedPlace.name}`}
          </Text>
        );
      } else {
        return (
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            Navigating to ???
          </Text>
        );
      }
    } else {
      return (

        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          Select a place to start navigating!
        </Text>
      );
    }
  };

  const renderModalGreeting = () => {
    if (selectedPlace) {
      const visitedBefore = selectedPlace.discoveredBy.some((d) => d.user._id === user._id);
      if (!visitedBefore) {
        return (
          <Text style={styles.modalText}>{`You discovered ${selectedPlace.name}!`}</Text>
        );
      } else {
        return (
          <Text style={styles.modalText}>{`Welcome back to ${selectedPlace.name}!`}</Text>
        );
      }
    }
    return null;
  };

  const compassStyle = {
    transform: [{ rotate: `${angle}deg` }],
  };

  // const renderHeading = () => {
  //   if (heading) {
  //     return (
  //       <View>
  //         <Text>
  //           Heading
  //           {heading.trueHeading}
  //           {angle}
  //         </Text>
  //       </View>
  //     );
  //   } else {
  //     return (
  //       <View>
  //         <Text>No heading</Text>
  //       </View>
  //     );
  //   }
  // };

  if (places) {
    return (
      <SafeAreaView style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
      }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
          }}
        >
          {`Hey ${user.username}, let's start exploring!`}
        </Text>

        {/* {renderHeading()} */}

        <Button
          onPress={() => navigation.navigate('Places')}
        >
          <ButtonText>Navigate to a Place</ButtonText>
        </Button>

        <Fab
          style={{
            marginBottom: 30,
            marginRight: 10,
          }}
          onPress={() => navigation.navigate('Create a Place')}
        >
          <FabIcon as={AddIcon} mr="$1" />
          <FabLabel>Create a New Place</FabLabel>
        </Fab>

        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          // This prop is for android users only
          onRequestClose={() => handleModalClose()}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.modalView}>
              {/* <Text style={styles.modalText}>{selectedPlace?.name}</Text> */}
              {renderModalGreeting()}
              <Text style={styles.modalDescription}>{selectedPlace?.description}</Text>
              <Button onPress={() => handleModalClose()}>
                <ButtonText>Close</ButtonText>
              </Button>
            </View>
          </View>
        </Modal>

        <View style={styles.container}>
          <View style={[styles.circle, compassStyle]}>
            {/* <View style={styles.triangle} /> */}
            <Image
              source={Arrow}
              style={{
                width: 100,
                height: 100,
                transform: [{ translateY: -10 }],
              }}
            />
          </View>
          <View
            style={{
              marginTop: 20,
              flex: 1,
              alignItems: 'center',
            }}
          >
            {renderCompass()}

            {
              selectedPlace ? (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                >
                  {`${distance} meters away`}
                </Text>
              )
                : null

            }

          </View>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 100,
    }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        Loading...
      </Text>

      {/* {renderHeading()} */}

      <Button
        onPress={() => navigation.navigate('Places')}
      >
        <ButtonText>Navigate to a Place</ButtonText>
      </Button>

      <Fab
        style={{
          marginBottom: 30,
          marginRight: 10,
        }}
        onPress={() => navigation.navigate('CreatePlace')}
      >
        <FabIcon as={AddIcon} mr="$1" />
        <FabLabel>Create A New Place</FabLabel>
      </Fab>

      {/* <View style={styles.container}>
        <View style={[styles.circle, compassStyle]}>
          <Image
            source={Arrow}
            style={{
              width: 100,
              height: 100,
              transform: [{ translateY: -10 }],
            }}
          />
        </View>
      </View> */}

      {/* {renderCompass()} */}
    </SafeAreaView>
    // <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    //   <Text>Loading...</Text>
    //   <Button
    //     title="Go to Places"
    //     onPress={() => navigation.navigate('Places')}
    //   />
    //   <Button
    //     title="Create a Place"
    //     onPress={() => navigation.navigate('CreatePlace')}
    //   />
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  circle: {
    marginTop: 100,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red', // Change the color if needed
    transform: [{ translateY: -10 }],
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDescription: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Compass;
