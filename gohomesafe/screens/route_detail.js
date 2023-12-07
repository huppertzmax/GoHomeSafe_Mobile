import React, {Component} from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable, Modal, Image } from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps'
import * as Location from 'expo-location'

const { width } = Dimensions.get('window');
const {combineLists, dateAndTime} = require('../utils/utils');


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
      if(location == null) {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
    
          if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
          }
    
          let locationData = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = locationData.coords;
          this.setState({ location: { latitude, longitude } });
        } catch (error) {
          console.error('Error fetching location: ', error);
        }
      }
    };


    render() {
  
        const { navigation, route } = this.props;
        const { startLat, startLon, endLat, endLon, middleLat, middleLon, deltaLat, deltaLon, coordinates, cctvs, sensorGoodLocations, sensorBadLocations, color } = route.params;
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
            //@TODO add location data if possible
            console.log(`ALARM: User at the position ${location.latitude}, ${location.longitude} on route from ${startLat}, ${startLon} to ${endLat}, ${endLon} at ${dateAndTimeString}`);
          }
          console.log(`ALARM: User at the position ${location.latitude}, ${location.longitude} on route from ${startLat}, ${startLon} to ${endLat}, ${endLon} at ${dateAndTimeString} requires help by the police`);
          //@TODO add sound and flashing red screen
          }
          catch {
            if (this.state.notifyFriends == true) {
              console.log(`ALARM: User on route from ${startLat}, ${startLon} to ${endLat}, ${endLon} at ${dateAndTimeString}`);
            }
            console.log(`ALARM: User on route from ${startLat}, ${startLon} to ${endLat}, ${endLon} at ${dateAndTimeString} requires help by the police`);
          }
        }

        return (
        <View style={{ flex: 1 }}>
          <View style={styles.containerBoxes} pointerEvents="box-none">
            <View style={styles.boxRoute}>
              <Text style={styles.textBoxHeader}>Route</Text>

              <View style={styles.pressableView}>
                <Pressable onPress={endRoute} style={styles.buttonEndRoute}>
                  <Text style={styles.textButton}>End route</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.boxAlarm}>
              <Text style={styles.textBoxHeader}>Notify police</Text>

              <View style={styles.pressableView}>
                <Pressable onPress={alarm} style={styles.buttonAlarm}>
                  <Text style={styles.textButton}>Alarm</Text>
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
            <View style={styles.modalView}>
                <Text style={styles.textModalHeader}>Friend Notification</Text>
                <Text style={styles.textModal}>Do you wish to inform your friends that you start your route?</Text>
                <View style={styles.container}>
                    <View style={styles.pressableViewLeft}>
                        <Pressable onPress={noNotification} style={styles.buttonDontSend}>
                            <Text style={styles.textButtonDontSend}>Don't notify</Text>
                        </Pressable>
                    </View>

                    <View style={styles.pressableViewRight}>
                        <Pressable onPress={notifyFriends} style={styles.buttonSend}>
                            <Text style={styles.textButtonSend}>Yes, notify</Text>
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
            <View style={styles.modalAlarmView}>
                <Text style={styles.textModalAlarmHeader}>Alarm send</Text>
                {this.state.location != null &&
                <Text style={styles.textModal}>The police is notified and is coming to your current location: {'\n'} {this.state.location.latitude}, {this.state.location.longitude}</Text>
                } 
                  <View style={styles.boxAlarmModal}>
                      <Pressable onPress={closeAlarmModal} style={styles.buttonAlarmClose}>
                          <Text style={styles.textButton}>Close window</Text>
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

        {sensorGoodLocations.map(sensor => (
            <Marker
            key={sensor.id}
            coordinate={{ latitude: sensor.coordinates[0], longitude: sensor.coordinates[1] }}
            pinColor="green" 
            title='Sensor safe'
        />
        ))}

        {sensorBadLocations.map(sensor => (
            <Marker
            key={sensor.id}
            coordinate={{ latitude: sensor.coordinates[0], longitude: sensor.coordinates[1] }}
            pinColor="red"
            title='Sensor unsafe'
        />
        ))}

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
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      width: 0.8*width,
      left: 0.1*width,
      right: 0.1*width,
    },
    containerBoxes: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: 20,
      zIndex: 2,
      width: width,
      height: 130,
    },
    modalView: {
        position: 'absolute',
        top: '40%',
        left: 0.05*width,
        width: 0.9*width,
        height: 160,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingTop: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.75,
        shadowRadius: 4,
        elevation: 5,
      },
      modalAlarmView: {
        position: 'absolute',
        top: '40%',
        left: 0.05*width,
        width: 0.9*width,
        height: 180,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingTop: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.75,
        shadowRadius: 4,
        elevation: 5,
      },
      textModalHeader: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'black',
      },
      textModalAlarmHeader: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#f54248',
      },
      textModal: {
        fontSize: 16,
        margin: 10,
        textAlign: 'center',
        color: 'black',
      },
      pressableViewLeft: {
        width: 0.4* width,
        alignContent: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        marginLeft: 20,
        marginRight: 20,
      },
      pressableViewRight: {
        width: 0.4* width,
        alignContent: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        marginRight: 20,
      },
      textButtonDontSend: {
        fontSize: 16,
        color: 'blue',
        textAlign: 'center'
      },
      textButtonSend: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
      },
      buttonDontSend: {
        borderColor: 'blue',
        borderWidth: 3,
        width: 120,
        height: 40,
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 10,
      },
      buttonSend: {
        backgroundColor: 'blue',
        borderColor: 'blue',
        width: 120,
        height: 40,
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 10,
      },
      buttonAlarmClose: {
        backgroundColor: '#f54248',
        borderColor: '#f54248',
        width: 140,
        height: 40,
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 10,
      },
      pressableView: {
        width: 160,
        height: 40,
        alignContent: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingTop: 10,
      },
      textBoxHeader: {
        fontSize: 18,
        paddingLeft: 10,
        paddingTop: 5,
        fontWeight: 'bold',
      },
      buttonEndRoute: {
        width: 160, 
        height: 40,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'blue',
        borderRadius: 10,
        marginTop: 10,
      },
      buttonAlarm: {
        width: 160, 
        height: 40,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: '#f54248',
        borderRadius: 10,
        marginTop: 10,
      },
      boxRoute: {
        width: 190,
        height: 95, 
        backgroundColor: 'white', 
        marginHorizontal: 5, 
        borderWidth: 5,
        borderColor: 'blue',
        borderRadius: 10,
      },
      boxAlarm: {
        width: 190,
        height: 95, 
        backgroundColor: 'white', 
        marginHorizontal: 5, 
        borderWidth: 5,
        borderColor: '#f54248',
        borderRadius: 10,
      },
      textButton: {
        textAlign: 'center',
        fontSize: 18,
      },
});
  
  export default Routing;