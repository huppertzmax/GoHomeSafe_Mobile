import React, {useState, useCallback, useEffect} from 'react';
import { View, Button, TextInput, Text, Dimensions, Keyboard} from 'react-native';
import * as Location from 'expo-location'
import { useFocusEffect } from '@react-navigation/native';
import { weatherData, geocode } from '../api/api';
import { homescreen_style } from '../styles/homescreen_style';


const { width } = Dimensions.get('window');
const {combineLists, dateAndTime, getWeatherRecommendation} = require('../utils/utils');


const HomeScreen = ({ navigation }) => {

  const [startText, setStartText] = useState('Daedeok-daero 185beon-gil');
  const [endText, setEndText] = useState('166 Gyeryong-ro 354beon-gil');

  const [startLat, setStartLat] = useState();
  const [startLon, setStartLon] = useState();
  const [endLat, setEndLat] = useState();
  const [endLon, setEndLon] = useState();

  const [location, setLocation] = useState(null);
  const [startIsLocation, setStartIsLocation] = useState(false);

  const [weather, setWeather] = useState(null);

  useFocusEffect(
    useCallback(() => {
      clearInputs();
    }, []) 
  );

  useEffect(() => {
    async function fetchWeatherData() {
      const data = await weatherData();
      setWeather(data);
    }
  
    fetchWeatherData();
  }, []);

  const clearInputs = () => {
    setStartText('Daedeok-daero 185beon-gil');
    setEndText('166 Gyeryong-ro 354beon-gil');
    setLocation(null);
    setStartIsLocation(false);

    setStartLat();
    setStartLon();
    setEndLat();
    setEndLon();
  };

  const handleSubmit = async () => {
    try {
      let startCoordinatesPromise;
      let endCoordinatesPromise;
      if (startIsLocation == true && location ) {
        setStartLat(location.latitude);
        setStartLon(location.longitude);
      }
      else {
        startCoordinatesPromise = geocoding(startText)
        .then(coordinatesStart => {
          if (coordinatesStart) {
            setStartLat(coordinatesStart.latitude);
            setStartLon(coordinatesStart.longitude);
          }
        })
        .catch(error => {
          throw new Error('Error fetching start coordinates: ' + error.message);
        });
      }

      endCoordinatesPromise = geocoding(endText)
      .then(coordinatesEnd => {
        if (coordinatesEnd) {
          setEndLat(coordinatesEnd.latitude);
          setEndLon(coordinatesEnd.longitude);
        }
      })
      .catch(error => {
        throw new Error('Error fetching end coordinates: ' + error.message);
      });

      await Promise.all([startCoordinatesPromise, endCoordinatesPromise]);

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
    }
  catch (error) {
    alert('Error: ' + error.message);
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

  const geocoding = async (address) => {
    try {
      const location = await geocode(address);
      if (location) {
        return location;
      } 
      else {
        alert('Error: Unable to find coordinates for the given address');
        return null;
      }
    } 
    catch (error) {
      console.error('Error finding coordinates: ', error);
      alert('Error: Something went wrong while finding coordinates');
    }
  }


  return (
    <View>
        <Text style={homescreen_style.textWelcome}>Welcome to</Text>
        <Text style={homescreen_style.header}>GoHomeSafe</Text>
        <TextInput
            style={homescreen_style.inputStart}
            placeholder="Start Latitude"
            value={startText}
            onChangeText={(text) => {
              setStartText(text);
              setStartIsLocation(false);
            }}
        />
        <Button title="Current Location" onPress={getLocation}/>

        <TextInput
            style={homescreen_style.inputEnd}
            placeholder="End address"
            value={endText}
            onChangeText={(text) => setEndText(text)}
        />
        <Button title="Minimize keyboard" onPress={dismissKeyboard}/>
        <Button title="Calculate route" onPress={handleSubmit}/>

        {weather && 
        <Text style={homescreen_style.headerWeather}>Weather in {weather.name}</Text>
        }
        {weather && <Text style={homescreen_style.textWeather}>Currently {weather.description}</Text>}
        {weather && <Text style={homescreen_style.textWeather}>Sunrise at {new Date(weather.sunrise * 1000).toLocaleTimeString()}</Text>}
        {weather && <Text style={homescreen_style.textWeather}>Sunset at {new Date(weather.sunset * 1000).toLocaleTimeString()}</Text>}
        
        {weather && <Text style={homescreen_style.textWeather}>We recommend {getWeatherRecommendation(weather)}</Text>}
    </View>
  );
};

export default HomeScreen;