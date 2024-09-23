// index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import CoinListScreen from './screens/CoinListScreen';
import MarketStatusScreen from './screens/MarketStatusScreen';
import CoinChartScreen from './screens/CoinChartScreen';


const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator>
        <Tab.Screen name="Coin List" component={CoinListScreen} />
        <Tab.Screen name="Market Status" component={MarketStatusScreen} />
        <Tab.Screen name="Coin Charts" component={CoinChartScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
