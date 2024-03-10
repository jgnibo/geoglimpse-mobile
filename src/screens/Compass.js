import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View, Text, Button, StyleSheet, Modal, SafeAreaView,
} from 'react-native';
import { getRhumbLineBearing, getDistance } from 'geolib';
import * as Location from 'expo-location';

function Compass({ navigation }) {
  const [heading, setHeading] = useState(null);
  const [angle, setAngle] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [distance, setDistance] = useState(9999);

  const dispatch = useDispatch();
  const { places, selectedPlace } = useSelector((state) => state.places);

  const { user } = useSelector((state) => state.user);
  const { longitude, latitude } = useSelector((state) => state.location);

  // Subscribe to device heading and handle compass angle updates
  useEffect(() => {
    let headingSubscription;
    (async () => {
      headingSubscription = await Location.watchHeadingAsync((newHeading) => {
        setHeading(newHeading);

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
  useEffect(() => {
    if (longitude && latitude && selectedPlace) {
      const computedDistance = getDistance(
        { latitude, longitude },
        { latitude: selectedPlace.location.coordinates[1], longitude: selectedPlace.location.coordinates[0] },
      );

      setDistance(computedDistance);

      // 6 meters is the approximate radius of each hexagon tile. From a UI perspective, it would look weird if a place was unlocked but the tile wasn't "explored." So ideally the user is within the tile when the explore a place
      if (computedDistance < 6) {
        setModalVisible(true);
        // dispatch discover action here
      }
    }
  }, [longitude, latitude, selectedPlace, dispatch]);

  const renderCompass = () => {
    if (selectedPlace) {
      return (
        <View>
          <Text>{`Navigating to ${selectedPlace.name}`}</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text>Select a place to get started</Text>
        </View>
      );
    }
  };

  const compassStyle = {
    transform: [{ rotate: `${angle}deg` }],
  };

  const renderHeading = () => {
    if (heading) {
      return (
        <View>
          <Text>
            Heading
            {heading.trueHeading}
            {angle}
          </Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text>No heading</Text>
        </View>
      );
    }
  };
  if (places) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>
          {`Hey ${user.username}! Let's start exploring`}
        </Text>
        {renderHeading()}
        {renderCompass()}
        <Text>{`Distance to target: ${distance} meters`}</Text>
        <Button
          title="Go to Places"
          onPress={() => navigation.navigate('Places')}
        />
        <Button
          title="Create a Place"
          onPress={() => navigation.navigate('CreatePlace')}
        />

        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{selectedPlace?.name}</Text>
              <Text style={styles.modalDescription}>{selectedPlace?.description}</Text>
              <Button title="Close" onPress={() => setModalVisible(!modalVisible)} />
            </View>
          </View>
        </Modal>

        <View style={styles.container}>
          <View style={[styles.circle, compassStyle]}>
            <View style={styles.triangle} />
          </View>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Loading...</Text>
      <Button
        title="Go to Places"
        onPress={() => navigation.navigate('Places')}
      />
      <Button
        title="Create a Place"
        onPress={() => navigation.navigate('CreatePlace')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'black',
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
