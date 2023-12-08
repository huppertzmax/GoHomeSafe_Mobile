import React, {useState, useCallback} from 'react';
import { View, Button, TextInput, StyleSheet, Text, Dimensions, Keyboard } from 'react-native';
import * as Location from 'expo-location'
import { useFocusEffect } from '@react-navigation/native';


const { width } = Dimensions.get('window');

//Example (semigood): 53 Daedeok-daero 185beon-gil, Daejeon to 16 Wolpyeong-ro 14beon-gil, Daejeon
//Example (semigood): 811 Wolpyeong-dong, Daejeon
//Thursday Party: 53 Daedeok-daero 185beon-gil, Daejeon
//GS25 (very good): 대전 서구 계룡로354번길 166

const HomeScreen = ({ navigation }) => {

  const [startText, setStartText] = useState('대전시 서구 둔산동 1100번지');
  const [endText, setEndText] = useState('대전 서구 계룡로354번길 166');

  const [startLat, setStartLat] = useState();
  const [startLon, setStartLon] = useState();
  const [endLat, setEndLat] = useState();
  const [endLon, setEndLon] = useState();

  const [location, setLocation] = useState(null);
  const [startIsLocation, setStartIsLocation] = useState(false);

  useFocusEffect(
    useCallback(() => {
      clearInputs();
    }, []) 
  );

  const clearInputs = () => {
    setStartText('대전시 서구 둔산동 1100번지');
    setEndText('대전 서구 계룡로354번길 166');
    setLocation(null);
    setStartIsLocation(false);

    setStartLat();
    setStartLon();
    setEndLat();
    setEndLon();
  };

  const handleSubmit = async () => {
    if (startIsLocation == true && location ) {
      setStartLat(location.latitude);
      setStartLon(location.longitude);
    }
    else {
      try {
        const coordinatesStart = await geoLocation(startText);
        if (coordinatesStart != null) {
          setStartLat(coordinatesStart.latitude);
          setStartLon(coordinatesStart.longitude);
        }
      }
      catch {
        alert('Error: Something went wrong while finding the start coordinates');
      }
    }

    try {
      const coordinatesEnd = await geoLocation(endText);
      if (coordinatesEnd != null) {
        setEndLat(coordinatesEnd.latitude);
        setEndLon(coordinatesEnd.longitude);
      }
    }
    catch {
      alert('Error: Something went wrong while finding the end coordinates');
    }

    if (startLat && startLon && endLat && endLon) {
      let lat = null;
      let lon = null;
        if (location != null) {
          lat = location.latitude;
          lon = location.longitude;
        }
        navigation.navigate('Map', {
          "startLat": parseFloat(startLat),
          "startLon": parseFloat(startLon),
          "endLat": parseFloat(endLat),
          "endLon": parseFloat(endLon),
          "lat": lat,
          "lon": lon,
        });
      } else {
        alert('Please fill out all fields');
      }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const getLocation = async () => {
      console.log('User requested current location')
      try {
        setStartIsLocation(true);
        setStartText('Loading location');
        let { status } = await Location.requestForegroundPermissionsAsync();
  
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          setStartIsLocation(false);
          setStartText();
          return;
        }
  
        let locationData = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = locationData.coords;
        console.log(`User location found ${latitude}, ${longitude}`)
        setLocation({ latitude, longitude });
        setStartText(`${latitude}, ${longitude}`)
      } 
      catch (error) {
        console.error('Error fetching location: ', error);
      }
  };

  const geoLocation = async (address) => {
    try {
      const location = await Location.geocodeAsync(address);
      if (location && location.length > 0) {
        console.log(`Geolocation result: ${location[0]} for: ${address}`)
        return location[0];
      } 
      else {
        Alert.alert('Error', 'Unable to find coordinates for the given address');
        return null;
      }
    } 
    catch (error) {
      console.error('Error finding coordinates: ', error);
      Alert.alert('Error', 'Something went wrong while finding coordinates');
    }
  }


  return (
    <View>
        <Text style={styles.textWelcome}>Welcome to</Text>
        <Text style={styles.header}>GoHomeSafe</Text>
        <TextInput
            style={styles.inputStart}
            placeholder="Start Latitude"
            value={startText}
            onChangeText={(text) => {
              setStartText(text);
              setStartIsLocation(false);
            }}
        />
        <Button title="Current Location" onPress={getLocation}/>

        <TextInput
            style={styles.inputEnd}
            placeholder="End address"
            value={endText}
            onChangeText={(text) => setEndText(text)}
        />
        <Button title="Minimize keyboard" onPress={dismissKeyboard}/>
        <Button title="Calculate route" onPress={handleSubmit}/>
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
    inputStart: {
      height: 40,
      width: width - 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
      marginHorizontal: 20,
    },
    inputEnd: {
      height: 40,
      width: width - 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
      marginTop: 40,
      marginHorizontal: 20,
      marginBottom: 20,
    },
    header: {
      fontSize: 50,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 30,
    },
    textWelcome: {
      fontSize: 32,
      fontWeight: 'normal',
      textAlign: 'center',
      marginTop: 20,
    },
    buttonRoute: {
      color: 'blue',
      borderBlockColor: 'blue',
      borderWidth: 2,
      borderRadius: 10,
    }
  });

export default HomeScreen;