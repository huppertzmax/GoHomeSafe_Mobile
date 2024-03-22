import React, {Component} from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable, Image } from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps'
import { safestRoute, fastestRoute, cctvLocations } from '../api/api';
import { map_style } from '../styles/map_style';

const { width } = Dimensions.get('window');
const {combineLists, dateAndTime, getWeatherRecommendation} = require('../utils/utils');



class Map extends Component {
  state = {
    coordinates_safest: [],
    duration_safest: 0.0,
    length_safest: 0.0,
    coordinates_fastest: [],
    duration_fastest: 0.0,
    length_fastest: 0.0,
    cctvs: [],
  };

  async componentDidMount() {
    try {
      console.log(" --------------- Requesting ---------------")
      const { navigation, route } = this.props;
      const { startLat, startLon, endLat, endLon } = route.params;
  
      const dict_safest = await safestRoute(startLat, startLon, endLat, endLon);
      const coordinates_safest = dict_safest.coordinates;
      const duration_safest = dict_safest.duration; 
      const length_safest = dict_safest.lenght;

      const dict_fastest = await fastestRoute(startLat, startLon, endLat, endLon);
      const coordinates_fastest = dict_fastest.coordinates;
      const duration_fastest = dict_fastest.duration; 
      const length_fastest = dict_fastest.lenght;

      const cctvLocationArray = await cctvLocations(startLat, startLon, endLat, endLon);
      const cctvIDs = Array.from({ length: cctvLocationArray.length }, (_, index) => index + 1);
      const cctvs = combineLists(cctvIDs, cctvLocationArray);

      this.setState({ coordinates_safest, duration_safest, length_safest,
        coordinates_fastest, duration_fastest, length_fastest, cctvs  });

        console.log(" --------------- Completed Requesting ---------------")
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  }

  render() {

    const { navigation, route } = this.props;
    const { startLat, startLon, endLat, endLon, lat, lon } = route.params;

    const middleLat = (startLat+endLat)/2.0;
    const middleLon = (startLon + endLon)/2.0;

    const deltaLat = Math.abs(startLat-middleLat)*2.0 + 0.001;
    const deltaLon = Math.abs(startLon-middleLon)*2.0 + 0.001;

    const startFast = () => {
      navigation.navigate('Routing', {
        "startLat": startLat,
        "startLon": startLon,
        "endLat": endLat,
        "endLon": endLon,
        "middleLat": middleLat, 
        "middleLon": middleLon,
        "deltaLat": deltaLat,
        "deltaLon": deltaLon,
        "coordinates": this.state.coordinates_fastest,
        "cctvs": this.state.cctvs,
        "color": "#f54248",
      });
      console.log("Fast route started");
    };

    const startSafe = () => {
      navigation.navigate('Routing', {
        "startLat": startLat,
        "startLon": startLon,
        "endLat": endLat,
        "endLon": endLon,
        "middleLat": middleLat, 
        "middleLon": middleLon,
        "deltaLat": deltaLat,
        "deltaLon": deltaLon,
        "coordinates": this.state.coordinates_safest,
        "cctvs": this.state.cctvs,
        "color": "#009c05",
      });
      console.log("Safe route started");
    };

    return (
      <View style={{ flex: 1 }}>
        <View style={map_style.container} pointerEvents="box-none">
          <View style={map_style.boxSafest}>
            <Text style={map_style.textBoxHeader}>Safest route</Text>

            <Text style={map_style.textBoxStats}>
              Length: {this.state.length_safest.toFixed(2)} m{'\n'}
              Duration: {this.state.duration_safest.toFixed(1)} min
            </Text>

            <View style={map_style.pressableView}>
              <Pressable onPress={startSafe} style={map_style.buttonSafe}>
                <Text style={map_style.textButton}>Start safest</Text>
              </Pressable>
            </View>
          </View>

          <View style={map_style.boxFastest}>
            <Text style={map_style.textBoxHeader}>Fastest route</Text>

            <Text style={map_style.textBoxStats} >
              Length: {this.state.length_fastest.toFixed(2)} m{'\n'}
              Duration: {this.state.duration_fastest.toFixed(1)} min
            </Text>

            <View style={map_style.pressableView}>
              <Pressable onPress={startFast} style={map_style.buttonFast}>
                <Text style={map_style.textButton}>Start fastest</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Map */}
        <MapView style={{ ...StyleSheet.absoluteFillObject }}
          initialRegion={{
          latitude: middleLat,
          longitude: middleLon,
          latitudeDelta: deltaLat,
          longitudeDelta: deltaLon,
          }} >
          
          <Marker
            coordinate={{latitude: startLat,longitude: startLon,}}
            title="Start"
            pinColor="blue"
          />

          <Marker
            coordinate={{latitude: endLat, longitude: endLon,}}
            title="Destination"
            pinColor="orange"
          />

          <Polyline coordinates={this.state.coordinates_fastest.map(coord => ({
              latitude: coord.latitude,
              longitude: coord.longitude,
            }))}
            strokeColor="#f54248"
            strokeWidth={5} 
          />  

          <Polyline coordinates={this.state.coordinates_safest.map(coord => ({
              latitude: coord.latitude,
              longitude: coord.longitude,
            }))}
            strokeColor="#009c05"
            strokeWidth={5} 
          />

          {this.state.cctvs.map(cctv => (
              <Marker
              key={cctv.id}
              coordinate={{ latitude: cctv.coordinates[0], longitude: cctv.coordinates[1] }}
              pinColor="black" 
              title='CCTV'
            />
          ))}

          {lat && lon && (
            <Marker
              coordinate={{
                latitude: lat,
                longitude: lon,
              }}
              title="Your Location"
              >
              <Image 
                source={require('../images/santa.png')}
                style={{ width: 60, height: 60 }}
              />
            </Marker>
          )}

          </MapView>
        </View>
    );
  }
};

export default Map;