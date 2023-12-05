import React, {Component} from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable, Button } from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps'
import { safestRoute, fastestRoute, sensorLocations, cctvLocations } from '../api/api';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';



const { width } = Dimensions.get('window');

//const startLat = 36.337651;
//const startLon = 127.389951;
//const endLat = 36.337487;
//const endLon = 127.378449;

class Map extends Component {
  state = {
    coordinates_safest: [],
    duration_safest: 0.0,
    length_safest: 0.0,
    coordinates_fastest: [],
    duration_fastest: 0.0,
    length_fastest: 0.0,
    cctvs: [],
    sensorGoodLocations: [],
    sensorBadLocations: [],
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

      const cctvs = await cctvLocations(startLat, startLon, endLat, endLon);
      const dictSensor = await sensorLocations(startLat, startLon, endLat, endLon);
      const sensorGoodLocations = dictSensor.sensorGoodLocations;
      const sensorBadLocations = dictSensor.sensorBadLocations;
      console.log("CCTVS")
      console.log(cctvs)
      console.log("Sensors")
      console.log(sensorGoodLocations)
      console.log(sensorBadLocations)

      this.setState({ coordinates_safest, duration_safest, length_safest,
        coordinates_fastest, duration_fastest, length_fastest, cctvs, sensorGoodLocations, sensorBadLocations  });

        console.log(" --------------- Completed Requesting ---------------")
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  }

  render() {

    const { navigation, route } = this.props;
    const { startLat, startLon, endLat, endLon } = route.params;

    const middleLat = (startLat+endLat)/2.0;
    const middleLon = (startLon + endLon)/2.0;

    const deltaLat = Math.abs(startLat-middleLat)*2.0 + 0.001;
    const deltaLon = Math.abs(startLon-middleLon)*2.0 + 0.001;

    const startFast = () => {
      console.log("Fast route started");
    };

    const startSafe = () => {
      console.log("Safe route started");
    };

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container} pointerEvents="box-none">
          <View style={styles.boxSafest}>
            <Text style={styles.textBoxHeader}>Safest route</Text>

            <Text style={styles.textBoxStats}>
              Length: {this.state.length_safest.toFixed(2)} m{'\n'}
              Duration: {this.state.duration_safest.toFixed(1)} min
            </Text>

            <View style={styles.pressableView}>
              <Pressable onPress={startSafe} style={styles.buttonSafe}>
                <Text style={styles.textButton}>Start safest</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.boxFastest}>
            <Text style={styles.textBoxHeader}>Fastest route</Text>

            <Text style={styles.textBoxStats} >
              Length: {this.state.length_fastest.toFixed(2)} m{'\n'}
              Duration: {this.state.duration_fastest.toFixed(1)} min
            </Text>

            <View style={styles.pressableView}>
              <Pressable onPress={startFast} style={styles.buttonFast}>
                <Text style={styles.textButton}>Start fastest</Text>
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
            title="End"
            pinColor="green"
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
          {console.log(this.state.sensorGoodLocations)}
          {this.state.sensorGoodLocations.map((lat, lon, safe) => (
            <Marker
              key={uuidv4()}
              coordinate={{ latitude: lat, longitude: lon }}
              pinColor="green" 
            />
          ))}

          {console.log(this.state.sensorBadLocations)}
          {this.state.sensorBadLocations.map((lat, lon, safe) => (
            <Marker
              key={uuidv4()}
              coordinate={{ latitude: lat, longitude: lon }}
              pinColor="red" 
            />
          ))}

          

          </MapView>
        </View>
    );
  }
};

const styles = StyleSheet.create({
  boxFastest: {
    width: 190,
    height: 130, 
    backgroundColor: 'white', 
    marginHorizontal: 5, 
    borderWidth: 5,
    borderColor: '#f54248',
    borderRadius: 10,
  },
  boxSafest: {
    width: 190,
    height: 130, 
    backgroundColor: 'white', 
    marginHorizontal: 5, 
    borderWidth: 5,
    borderColor: '#009c05',
    borderRadius: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 20,
    zIndex: 2,
    width: width,
    height: 130,
  },
  textBoxHeader: {
    fontSize: 18,
    paddingLeft: 5,
    paddingTop: 5,
    fontWeight: 'bold',
  },
  textBoxStats: {
    fontSize: 16,
    paddingLeft: 5,
    paddingTop: 2,
  },
  buttonSafe: {
    width: 160, 
    height: 40,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#009c05',
    borderRadius: 10,
  },
  buttonFast: {
    width: 160, 
    height: 40,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#f54248',
    borderRadius: 10,

  },
  textButton: {
    textAlign: 'center',
    fontSize: 18,
  },
  pressableView: {
    width: 160,
    height: 40,
    alignContent: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingTop: 10,
  }
});

export default Map;