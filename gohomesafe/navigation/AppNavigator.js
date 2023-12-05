import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/homescreen';
import Map from '../screens/map';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
  );
};

export default AppNavigator;