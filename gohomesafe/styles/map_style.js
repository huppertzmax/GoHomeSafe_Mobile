import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get('window');

const generateBoxStyle = (borderCorlor) => ({
    width: 190,
    height: 130, 
    backgroundColor: 'white', 
    marginHorizontal: 5, 
    borderWidth: 5,
    borderColor: borderCorlor,
    borderRadius: 10,
});

const generateButtonStyle = (backgroundColor) => ({
    width: 160, 
    height: 40,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: backgroundColor,
    borderRadius: 10,
}); 

export const map_style = StyleSheet.create({
    boxFastest: generateBoxStyle('#f54248'),
    boxSafest: generateBoxStyle('#009c05'),
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
      paddingLeft: 10,
      paddingTop: 5,
      fontWeight: 'bold',
    },
    textBoxStats: {
      fontSize: 16,
      paddingLeft: 10,
      paddingTop: 2,
    },
    buttonSafe: generateButtonStyle('#009c05'),
    buttonFast: generateButtonStyle('#f54248'),
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