import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get('window');

const generateTextModals = (color) => ({
    fontWeight: 'bold',
    fontSize: 20,
    color: color,
});

const generateButtonText = (color) => ({
    fontSize: 16,
    color: color,
    textAlign: 'center'
});

const generateButtonSending = (backgroundColor, borderColor, width) => ({
    backgroundColor: backgroundColor,
    borderColor: borderColor,
    borderWidth: 3,
    width: width,
    height: 40,
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 10,
});

const generateButtonBox = (backgroundColor) => ({
    width: 160, 
    height: 40,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: backgroundColor, 
    borderRadius: 10,
    marginTop: 10,
});

const generateBox = (borderColor) => ({
    width: 190,
    height: 95, 
    backgroundColor: 'white', 
    marginHorizontal: 5, 
    borderWidth: 5,
    borderColor: borderColor,
    borderRadius: 10,
});

const generateModal = (modalHeight) => ({
    position: 'absolute',
    top: '40%',
    left: 0.05*width,
    width: 0.9*width,
    height: modalHeight,
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
});

const generatePressableView = (marginLeft) => ({
    width: 0.4* width,
    alignContent: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    marginLeft: marginLeft,
    marginRight: 20,
});

export const route_style = StyleSheet.create({
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
    modalView: generateModal(160),
    modalAlarmView: generateModal(180),

    textModalHeader: generateTextModals('black'),
    textModalAlarmHeader: generateTextModals('#f54248'),

    textModal: {
        fontSize: 16,
        margin: 10,
        textAlign: 'center',
        color: 'black',
    },

    pressableViewLeft: generatePressableView(20),
    pressableViewRight: generatePressableView(0),

    textButtonDontSend: generateButtonText('blue'),
    textButtonSend: generateButtonText('white'),

    buttonDontSend: generateButtonSending('white', 'blue', 120),
    buttonSend: generateButtonSending('blue', 'blue', 120),
    buttonAlarmClose: generateButtonSending('#f54248', '#f54248', 140),

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

    buttonEndRoute: generateButtonBox('blue'),
    buttonAlarm: generateButtonBox('#f54248'),

    boxRoute: generateBox('blue'),
    boxAlarm: generateBox('#f54248'),

    textButton: {
        textAlign: 'center',
        fontSize: 18,
    },
});