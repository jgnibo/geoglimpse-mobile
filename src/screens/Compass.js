import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View, Text, Button, StyleSheet,
} from 'react-native';
import * as Location from 'expo-location';

import { getRhumbLineBearing, getCompassDirection } from 'geolib';

function Compass({ navigation }) {
  const [heading, setHeading] = useState(null);
  const [angle, setAngle] = useState(0);
  const {
    // eslint-disable-next-line no-unused-vars
    places, selectedPlace, status, error,
  } = useSelector((state) => state.places);

  const { user, userStatus, userError } = useSelector((state) => state.user);
  const { longitude, latitude } = useSelector((state) => state.location);

  useEffect(() => {
    (async () => {
      await Location.watchHeadingAsync((newHeading) => {
        setHeading(newHeading);

        if (longitude && latitude) {
          const idealBearing = getRhumbLineBearing(
            { latitude, longitude },
            { latitude: 43.702806, longitude: -72.288527 },
          );

          console.log('LOOK HERE', idealBearing, newHeading.trueHeading);
          console.log(angle);

          setAngle(idealBearing - newHeading.trueHeading);
        }
      });
    })();
  }, []);

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

  const renderIdealHeading = () => {
    if (longitude && latitude) {
      const rhumbBearing = getRhumbLineBearing(
        { latitude, longitude },
        { latitude: 43.702806, longitude: -72.288527 },
      );

      const compassDirection = getCompassDirection(
        { latitude, longitude },
        { latitude: 43.702806, longitude: -72.288527 },
      );

      return (
        <View>
          <Text>
            Ideal Heading Rhumb
            {rhumbBearing}
            Compass Direction
            {compassDirection}
          </Text>
        </View>
      );
    }
  };

  const compassStyle = {
    transform: [{ rotate: `${angle}deg` }],
  };

  const renderHeading = () => {
    if (heading) {
      /* console.log('HEADING', heading);
      console.log('TRUE HEADING', heading.trueHeading); */
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
        <Text>
          Hello
          {latitude}
          {longitude}
        </Text>
        {renderHeading()}
        {renderCompass()}
        {renderIdealHeading()}
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

// 43.702806, -72.288527

// RHUMB LINE BEARING IS WHAT WE WANT. SO WE need to get the true heading to match the rhumb line bearing
