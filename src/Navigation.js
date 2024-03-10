import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import * as Location from 'expo-location';
import Compass from './screens/Compass';
import CreatePlace from './screens/CreatePlace';
import Places from './screens/Places';
import Login from './screens/Login';

import { setLocation } from './redux/locationSlice';

const Stack = createStackNavigator();

export default function Navigation() {
  const dispatch = useDispatch();
  // const [errorMsg, setErrorMsg] = useState(null);
  const [ws, setWs] = useState(null);

  const { user } = useSelector((state) => state.user);

  const [lastSentLocation, setLastSentLocation] = useState([0, 0]);
  const lastSentLocationRef = useRef([0, 0]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // setErrorMsg('Permission to access location was denied');
        return;
      }

      console.log('WebSocket creating');
      const webSocket = new WebSocket('wss://geoglimpse-backend-r6sn.onrender.com');
      // console.log('WebSocket created', webSocket);
      webSocket.onopen = () => {
        console.log('Connected to the server');
      };
      webSocket.onerror = (error) => {
        console.log('WebSocket error', error);
      };
      setWs(webSocket);

      await Location.watchPositionAsync(
        {
          // TRY CHANGING THIS TO BESTFORNAVIGATION INSTEAD OF HIGH
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 10000,
          distanceInterval: 0,
        },
        (newLocation) => {
          const newLat = Math.trunc(newLocation.coords.latitude * 100000) / 100000;
          const newLong = Math.trunc(newLocation.coords.longitude * 100000) / 100000;
          if (!lastSentLocationRef || (newLat && newLong && (newLat !== lastSentLocationRef.current[0] || newLong !== lastSentLocationRef.current[1]))) {
            setLastSentLocation([newLat, newLong]);
            dispatch(setLocation({ latitude: newLat, longitude: newLong }));
            lastSentLocationRef.current = [newLat, newLong];
          }
        },
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
    <NavigationContainer>
      <Stack.Navigator>
        {user && user._id
          ? (
            <>
              <Stack.Screen name="Home" component={Compass} />
              <Stack.Screen name="Places" component={Places} />
              <Stack.Screen name="CreatePlace" component={CreatePlace} />

            </>
          )
          : <Stack.Screen name="Login" component={Login} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
