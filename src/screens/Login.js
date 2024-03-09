// LoginPage.js
import React, { useState } from 'react';
import {
  View, TextInput, Button, Text,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/userSlice'; // Assuming you have a login async thunk

function LoginPage() {
  const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.user);

  const handleLogin = () => {
    // Dispatch login action here, passing username and password
    console.log('USERNAME ERE', username);
    console.log(user, status, error);
    dispatch(login({ username }));
  };

  return (
    <View>
      <Text>Welcome to geoglimpse</Text>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      {/* <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry /> */}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

export default LoginPage;
