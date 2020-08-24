import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import StartScreen from '../StartScreen';
import GameScreen from '../level';
import GameScreen2 from '../levelTwo';
import GameScreen3 from '../levelThree';
import LevelComplete from '../LevelComplete';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* Rest of your app code */}
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        <Stack.Screen name="GameScreen2" component={GameScreen2} />
        <Stack.Screen name="GameScreen3" component={GameScreen3} />
        <Stack.Screen name="LevelComplete" component={LevelComplete} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
