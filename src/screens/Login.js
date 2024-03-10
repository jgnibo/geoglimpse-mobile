// LoginPage.js
import React, { useState } from 'react';
import {
  Text,
} from 'react-native';
import { useDispatch } from 'react-redux';
import {
  FormControl, Input, InputField, Button, ButtonText, SafeAreaView,
} from '@gluestack-ui/themed';
import userApi from '../requests/userApi';
import { setUser } from '../redux/userSlice';

function LoginPage() {
  const [loginError, setLoginError] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const { success, message } = await userApi.login({ username, password });
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
    <SafeAreaView style={{ flex: 1, alignItems: 'center', marginTop: 200 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        Welcome to GeoGlimpse!
      </Text>
      <FormControl
        size="md"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}
        isRequired={false}
        style={{ width: 300 }}
      >
        <Input
          style={{ marginBottom: 20 }}
        >
          <InputField
            type="text"
            defaultValue=""
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
        </Input>
        <Input
          style={{ marginBottom: 20 }}
        >
          <InputField
            type="password"
            defaultValue=""
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
          />
        </Input>

      </FormControl>
      <Text style={{ color: 'red', marginBottom: 20 }}>
        {loginError}
      </Text>
      {/* <TextInput placeholder="Username" value={username} onChangeText={setUsername} /> */}
      {/* <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry /> */}
      <Button onPress={handleLogin}>
        <ButtonText>Log in</ButtonText>
      </Button>

    </SafeAreaView>
  );
}

export default LoginPage;
