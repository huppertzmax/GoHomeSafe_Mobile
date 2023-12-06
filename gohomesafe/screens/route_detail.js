import React, {Component} from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable, Modal, TouchableHighlight } from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps'

const { width } = Dimensions.get('window');

class Routing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true,
        };
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };

    render() {
  
        const { navigation, route } = this.props;
        const { startLat, startLon, endLat, endLon, middleLat, middleLon, deltaLat, deltaLon, coordinates, cctvs, sensorGoodLocations, sensorBadLocations, color } = route.params;
        const modalVisible = this.state.modalVisible;

        const noNotification = () => {
            this.setModalVisible(false)
        }
        const notifyFriends = () => {
            const date = new Date();
            const optionsDate = { timeZone: 'Asia/Seoul', dateStyle: 'full' };
            const dateString = date.toLocaleString('en-US', optionsDate);

            const optionsTime = { timeZone: 'Asia/Seoul', timeStyle: 'short', hour12: false};
            const timeString = date.toLocaleString('en-US', optionsTime);

            console.log(`User started route from ${startLat}, ${startLon} to ${endLat}, ${endLon} at ${dateString} ${timeString}`);
            this.setModalVisible(false)
        }

        return (
        <View style={{ flex: 1 }}>
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
      textModalHeader: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'black',
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
      }
});
  
  export default Routing;