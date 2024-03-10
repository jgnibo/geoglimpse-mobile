import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  View, Text, Button, StyleSheet,
} from 'react-native';
import { getRhumbLineBearing } from 'geolib';
import * as Location from 'expo-location';

function Compass({ navigation }) {
  const [heading, setHeading] = useState(null);
  const [angle, setAngle] = useState(0);
  const {
    // eslint-disable-next-line no-unused-vars
    places, selectedPlace, status, error,
  } = useSelector((state) => state.places);

  const { user } = useSelector((state) => state.user);
  const { longitude, latitude } = useSelector((state) => state.location);

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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>
          {`Hey ${user.username}! Let's start exploring`}
        </Text>
        {renderHeading()}
        {renderCompass()}
        <Button
          title="Go to Places"
          onPress={() => navigation.navigate('Places')}
        />
        <Button
          title="Create a Place"
          onPress={() => navigation.navigate('CreatePlace')}
        />

        <View style={styles.container}>
          <View style={[styles.circle, compassStyle]}>
            <View style={styles.triangle} />
          </View>
        </View>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Loading...</Text>
      <Button
        title="Go to Places"
        onPress={() => navigation.navigate('Places')}
      />
      <Button
        title="Create a Place"
        onPress={() => navigation.navigate('CreatePlace')}
      />
    </View>
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
});

export default Compass;
