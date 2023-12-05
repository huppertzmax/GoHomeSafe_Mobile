import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps'
//import Config from 'react-native-config';

const url = "http://143.248.216.170:5000/route"

const startLat = 36.337651;
const startLon = 127.389951;
const endLat = 36.337487;
const endLon = 127.378449;

//coordinates = 
/*const formattedCoordinates = coordinates.map(coordinate => ({
  latitude: coordinate[1],
  longitude: coordinate[0]
}));
*/

export default class App extends Component {
  state = {
    coordinates: [], 
  };

  componentDidMount() {
    this.fetchCoordinates();
  }

  fetchCoordinates = async () => {
    try {
      console.log(`Requesting: ${url}?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`)
      const response = await fetch(`${url}?start_lat=${startLat}&start_lon=${startLon}&end_lat=${endLat}&end_lon=${endLon}`);
      
      if (response.ok) {
        const data = await response.json();
        const coordinates = data.coordinates.map(coordinate => ({
          latitude: coordinate[1],
          longitude: coordinate[0],
        }));
        this.setState({ coordinates });
      } 
      else {
        console.error('Failed to fetch data');
      }
    } 
    catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  render() {
    return (
      <MapView style={{ ...StyleSheet.absoluteFillObject }}
        initialRegion={{
        latitude: startLat,
        longitude: startLon,
        latitudeDelta: .008,
        longitudeDelta: .008
        }} >
         
        <Marker
          coordinate={{latitude: startLat,longitude: startLon,}}
          title="Start"
        />

        <Marker
          coordinate={{latitude: endLat, longitude: endLon,}}
          title="End"
        />

      <Polyline coordinates={this.state.coordinates.map(coord => ({
          latitude: coord.latitude,
          longitude: coord.longitude,
        }))}
        strokeColor="#1b6ef5"
        strokeWidth={5} 
        />
      </MapView>
    );
  }
}