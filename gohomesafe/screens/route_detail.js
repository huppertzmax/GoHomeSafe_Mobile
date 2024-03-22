import React, {Component} from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable, Modal, Image } from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps'
import * as Location from 'expo-location'
import { route_style } from '../styles/route_style'

const { width } = Dimensions.get('window');
const {combineLists, dateAndTime, getWeatherRecommendation} = require('../utils/utils');


class Routing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true,
            notifyFriends: false,
            location: null,
            modalAlarmVisible: false,
        };
    }


    async componentDidMount() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
  
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }
  
        this.locationListener = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 5000,
            distanceInterval: 0, 
          },
          (newLocation) => {
            this.setState({ location: newLocation.coords });
          }
        );
      } catch (error) {
        console.error('Error getting location', error);
      }
    }
  
    componentWillUnmount() {
      if (this.locationListener) {
        this.locationListener.remove();
      }
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };

    setNotifyFriends = (notfiy) => {
      this.setState({ notifyFriends: notfiy });
    };

    setmodalAlarmVisible = (visible) => {
      this.setState({ modalAlarmVisible: visible });
    };

    getLocation = async () => {
      if(this.state.location == null) {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
    
          if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
          }
    
          let locationData = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = locationData.coords;
          setState({ location: { latitude, longitude } });
        } catch (error) {
          console.error('Error fetching location: ', error);
        }
      }
    };


    render() {
  
        const { navigation, route } = this.props;
        const { startLat, startLon, endLat, endLon, middleLat, middleLon, deltaLat, deltaLon, coordinates, cctvs, color } = route.params;
        const modalVisible = this.state.modalVisible;
        const modalAlarmVisible = this.state.modalAlarmVisible;

        const noNotification = () => {
            this.setModalVisible(false);
            this.setNotifyFriends(false);
        }
        const notifyFriends = () => {
            const dateAndTimeString = dateAndTime();  

            console.log(`User started route from ${startLat}, ${startLon} to ${endLat}, ${endLon} at ${dateAndTimeString}`);
            this.setModalVisible(false);
            this.setNotifyFriends(true);
        }

        const endRoute = () => {
          if (this.state.notifyFriends == true) {
            const dateAndTimeString = dateAndTime();
            console.log(`User ended route from ${startLat}, ${startLon} to ${endLat}, ${endLon} at ${dateAndTimeString}`);
          }
          navigation.navigate('Home');
        }

        const closeAlarmModal = () => {
          this.setmodalAlarmVisible(false)
        }

        const alarm = async () => {
          const dateAndTimeString = dateAndTime();
          this.setmodalAlarmVisible(true);
          try {
            await this.getLocation();
            const location = this.state.location;

            if (this.state.notifyFriends == true) {
            console.log(`ALERT: User at the position ${location.latitude}, ${location.longitude} on route from ${startLat}, ${startLon} to ${endLat}, ${endLon} at ${dateAndTimeString}`);
          }
          console.log(`ALERT: User at the position ${location.latitude}, ${location.longitude} on route from ${startLat}, ${startLon} to ${endLat}, ${endLon} at ${dateAndTimeString} requires help by the police`);
          //@TODO add sound and flashing red screen
          }
          catch (error){
            console.log(error)
            if (this.state.notifyFriends == true) {
              console.log(`ALERT: User on route from ${startLat}, ${startLon} to ${endLat}, ${endLon} at ${dateAndTimeString}`);
            }
            console.log(`ALERT: User on route from ${startLat}, ${startLon} to ${endLat}, ${endLon} at ${dateAndTimeString} requires help by the police`);
          }
        }

        return (
        <View style={{ flex: 1 }}>
          <View style={route_style.containerBoxes} pointerEvents="box-none">
            <View style={route_style.boxRoute}>
              <Text style={route_style.textBoxHeader}>Route</Text>

              <View style={route_style.pressableView}>
                <Pressable onPress={endRoute} style={route_style.buttonEndRoute}>
                  <Text style={route_style.textButton}>End route</Text>
                </Pressable>
              </View>
            </View>

            <View style={route_style.boxAlarm}>
              <Text style={route_style.textBoxHeader}>Notify police</Text>

              <View style={route_style.pressableView}>
                <Pressable onPress={alarm} style={route_style.buttonAlarm}>
                  <Text style={route_style.textButton}>Alert</Text>
                </Pressable>
              </View>
            </View>
        </View>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                this.setModalVisible(!modalVisible);
            }}
            >
            <View style={route_style.modalView}>
                <Text style={route_style.textModalHeader}>Friend Notification</Text>
                <Text style={route_style.textModal}>Do you wish to inform your friends that you start your route?</Text>
                <View style={route_style.container}>
                    <View style={route_style.pressableViewLeft}>
                        <Pressable onPress={noNotification} style={route_style.buttonDontSend}>
                            <Text style={route_style.textButtonDontSend}>Don't notify</Text>
                        </Pressable>
                    </View>

                    <View style={route_style.pressableViewRight}>
                        <Pressable onPress={notifyFriends} style={route_style.buttonSend}>
                            <Text style={route_style.textButtonSend}>Yes, notify</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalAlarmVisible}
            onRequestClose={() => {
                this.setModalVisible(!modalAlarmVisible);
            }}
            >
            <View style={route_style.modalAlarmView}>
                <Text style={route_style.textModalAlarmHeader}>Alert send</Text>
                {this.state.location != null &&
                <Text style={route_style.textModal}>The police is notified and is coming to your current location: {'\n'} {this.state.location.latitude}, {this.state.location.longitude}</Text>
                } 
                  <View style={route_style.boxAlarmModal}>
                      <Pressable onPress={closeAlarmModal} style={route_style.buttonAlarmClose}>
                          <Text style={route_style.textButton}>Close window</Text>
                      </Pressable>
                  </View>
            </View>
        </Modal>


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

        {this.state.location && (
            <Marker
              coordinate={{
                latitude: this.state.location.latitude,
                longitude: this.state.location.longitude,
              }}
              title="Your Location"
              >
              <Image 
                source={require('../images/santa.png')}
                style={{ width: 60, height: 60 }}
              />
            </Marker>
          )}

        <Polyline coordinates={coordinates.map(coord => ({
            latitude: coord.latitude,
            longitude: coord.longitude,
            }))}
            strokeColor={color}
            strokeWidth={5} 
        /> 

        {cctvs.map(cctv => (
            <Marker
            key={cctv.id}
            coordinate={{ latitude: cctv.coordinates[0], longitude: cctv.coordinates[1] }}
            pinColor="black" 
            title='CCTV'
        />
        ))}

        <Marker
            coordinate={{latitude: endLat, longitude: endLon,}}
            title="Destination"
            pinColor="orange"
        />

        </MapView>
        </View>
      );
    }
  };
  
export default Routing;