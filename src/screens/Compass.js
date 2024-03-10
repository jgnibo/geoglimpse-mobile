import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  View, Text, StyleSheet, Image,
} from 'react-native';

import {
  SafeAreaView, Fab, FabLabel, AddIcon, FabIcon, Button, ButtonText,
} from '@gluestack-ui/themed';
import { getRhumbLineBearing } from 'geolib';
import * as Location from 'expo-location';

import Arrow from '../assets/arrow.png';

function Compass({ navigation }) {
  // const [heading, setHeading] = useState(null);
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

  const renderCompass = () => {
    const isDiscovered = selectedPlace.discoveredBy.some((discoverer) => discoverer.user._id === user._id);
    if (selectedPlace && isDiscovered) {
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
    } else if (selectedPlace && !isDiscovered) {
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
            }}
          >
            {renderCompass()}
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
});

export default Compass;
