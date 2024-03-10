// LoginPage.js
import React, { useState } from 'react';
import {
  View, TextInput, Button, Text,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import userApi from '../requests/userApi';

function LoginPage() {
  const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const { success, message } = await userApi.login({ username, password: 'test123' });
      if (!success) {
        setLoginError(message);
      } else {
        const response = await userApi.verifyUser();
        if (response.status && response.user) {
          dispatch(setUser(response.user));
        } else {
          setLoginError('Error verifying user');
        }
      }
    } catch (error) {
      console.log('Error here', error);
    }
  };

  return (
    <View>
      <Text>Welcome to geoglimpse</Text>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <Text>{loginError}</Text>
      {/* <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry /> */}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

export default LoginPage;
