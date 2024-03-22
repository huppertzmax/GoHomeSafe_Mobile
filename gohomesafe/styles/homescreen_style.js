import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get('window');

export const homescreen_style = StyleSheet.create({
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
    },
    headerWeather: {
      marginLeft: 10,
      marginTop: 40,
      fontSize: 30,
      marginBottom: 10,
    }, 
    textWeather: {
      marginLeft: 20,
      marginBottom: 10,
      fontSize: 20,
      marginRight: 20,
    }, 
    weatherIcon: {
      borderColor: 'black',
      borderWidth: 1, 
    }
  });