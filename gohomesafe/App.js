import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import MapView, {Polyline} from 'react-native-maps'
//import Config from 'react-native-config';

const url = "http://127.0.0.1:5000/route"

const startLat = 127.363;
const startLon = 36.372;
const endLat = 127.4;
const endLon = 36.4;

//coordinates = 
/*const formattedCoordinates = coordinates.map(coordinate => ({
  latitude: coordinate[1],
  longitude: coordinate[0]
}));
*/

export default class App extends Component {
  state = {
    formattedCoordinates: [], 
  };

  componentDidMount() {
    this.fetchCoordinates();
  }

  fetchCoordinates = async () => {
    try {
      console.log(`Requesting: ${url}?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`)
      const response = await fetch(
        `${url}?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`
      );
      console.log(response)
      
      if (response.ok) {
        const data = await response.json();
        const formattedCoordinates = data.coordinates.map(coordinate => ({
          latitude: coordinate[1],
          longitude: coordinate[0],
        }));
        this.setState({ formattedCoordinates });
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  render() {
    return (
      <MapView style={{ ...StyleSheet.absoluteFillObject }}
        initialRegion={{
        latitude: 36.372,
        longitude: 127.363,
        latitudeDelta: .008,
        longitudeDelta: .008
        }} > 
      {( this.state.length > 0 && 
      <Polyline coordinates={this.state}
        strokeColor="#1b6ef5"
        strokeWidth={5} 
        />)}
      </MapView>
    );
  }
}