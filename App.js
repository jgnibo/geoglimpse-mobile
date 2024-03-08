import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import React, { useState, useEffect, useRef } from 'react';

import * as Location from 'expo-location';


export default function App() {
  const [errorMsg, setErrorMsg] = useState(null);
  const [ws, setWs] = useState(null);

  const [lastSentLocation, setLastSentLocation] = useState([0, 0]);
  const lastSentLocationRef = useRef([0, 0]);


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      console.log('WebSocket creating');
      const webSocket = new WebSocket('ws://192.168.2.193:8000');
      console.log('WebSocket created', webSocket);
      webSocket.onopen = () => {
        console.log('Connected to the server');
      };
      webSocket.onerror = (error) => {
        console.log('WebSocket error', error);
      };
      setWs(webSocket);

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 0
        },
        (newLocation) => {
          const newLat = Math.trunc(newLocation.coords.latitude * 100000) / 100000;
          const newLong = Math.trunc(newLocation.coords.longitude * 100000) / 100000;
          if (!lastSentLocationRef || (newLat && newLong && (newLat !== lastSentLocationRef.current[0] || newLong !== lastSentLocationRef.current[1]))) {
            setLastSentLocation([newLat, newLong]);
            lastSentLocationRef.current = [newLat, newLong];
          }
        }
      );
    })();
  }, []);

  useEffect(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        latitude: lastSentLocation[0],
        longitude: lastSentLocation[1],
      }));
    }
  }, [lastSentLocation]);

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>hell0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
