import React, {useState} from 'react';
import { View, Button, TextInput, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {

  const handleSubmit = () => {
    if (startLat && startLon && endLat && endLon) {
        navigation.navigate('Map', {
          "startLat": parseFloat(startLat),
          "startLon": parseFloat(startLon),
          "endLat": parseFloat(endLat),
          "endLon": parseFloat(endLon),
        });
      } else {
        alert('Please fill out all fields');
      }
  };

  const [startLat, setStartLat] = useState('36.337651');
  const [startLon, setStartLon] = useState('127.389951');
  const [endLat, setEndLat] = useState('36.337487');
  const [endLon, setEndLon] = useState('127.378449');

  const handleStartLatChange = (text) => {
    setStartLat(text);
  };

  const handleStartLonChange = (text) => {
    setStartLon(text);
  };

  const handleEndLatChange = (text) => {
    setEndLat(text);
  };

  const handleEndLonChange = (text) => {
    setEndLon(text);
  };

  return (
    <View>
        <TextInput
            style={styles.input}
            placeholder="Start Latitude"
            value={startLat}
            onChangeText={handleStartLatChange}
        />
        <TextInput
            style={styles.input}
            placeholder="Start Longitude"
            value={startLon}
            onChangeText={handleStartLonChange}
        />
        <TextInput
            style={styles.input}
            placeholder="End Latitude"
            value={endLat}
            onChangeText={handleEndLatChange}
        />
        <TextInput
            style={styles.input}
            placeholder="End Longitude"
            value={endLon}
            onChangeText={handleEndLonChange}
        />
        <Button title="Calculate route" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    input: {
      height: 40,
      width: '100%',
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
      marginBottom: 20,
    },
  });

export default HomeScreen;