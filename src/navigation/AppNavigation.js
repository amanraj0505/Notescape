import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import {MainScreen, AddNotesScreen, SplashScreen} from '../screens';
const stackNavigator = createStackNavigator({
  Main: {
    screen: MainScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  AddNotes: {
    screen: AddNotesScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
});
const switchNavigator = createSwitchNavigator({
  Splash: SplashScreen,
  MainStack: stackNavigator,
});
export default createAppContainer(switchNavigator);
