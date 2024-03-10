import React, { useState } from 'react';
import {
  Input, InputField, Button, ButtonText, SafeAreaView, FormControl,
} from '@gluestack-ui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { createPlace } from '../redux/placesSlice';

function CreatePlaceScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const {
    // eslint-disable-next-line no-unused-vars
    places, selectedPlace, status, error,
  } = useSelector((state) => state.places);

  const { user } = useSelector((state) => state.user);
  const { longitude, latitude } = useSelector((state) => state.location);

  const dispatch = useDispatch();

  const handleCreatePlace = async () => {
    if (!name.trim() || !description.trim()) {
      alert('Please fill in all fields');
      return;
    }
    try {
      const trimmedName = name.trim();
      const trimmedDesc = description.trim();
      await dispatch(createPlace({
        creatorId: user._id, name: trimmedName, description: trimmedDesc, imageUrl: '', location: { type: 'Point', coordinates: [longitude, latitude] }, isPublic: true,
      }));
      if (status === 'idle' && !error) {
        navigation.navigate('Home');
      } else {
        // Add in error handling here
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    // <View style={styles.container}>
    //   <TextInput
    //     style={styles.input}
    //     placeholder="Name"
    //     value={name}
    //     onChangeText={setName}
    //   />
    //   <TextInput
    //     style={styles.input}
    //     placeholder="Description"
    //     value={description}
    //     onChangeText={setDescription}
    //     multiline
    //   />
    //   <Button
    //     title="Create Place"
    //     onPress={handleCreatePlace}
    //   />
    // </View>
    <SafeAreaView style={{ flex: 1, alignItems: 'center', marginTop: 50 }}>
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
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
        </Input>
        <Input
          style={{ marginBottom: 20 }}
        >
          <InputField
            type="text"
            defaultValue=""
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
        </Input>
      </FormControl>
      <Button onPress={handleCreatePlace}>
        <ButtonText>Create Place</ButtonText>
      </Button>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'flex-start',
//     justifyContent: 'center',
//   },
//   input: {
//     width: '100%',
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#cccccc',
//     padding: 10,
//   },
// });

export default CreatePlaceScreen;
