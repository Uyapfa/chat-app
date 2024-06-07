import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from './pages/Landing';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import 'react-native-gesture-handler';
import Register from './pages/Register'
import Store from './store/store';
import { Provider } from 'react-redux';
import GroupChat from './pages/ChatScreenGrup';
import ProfilePage from './pages/ProfileScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          <Stack.Screen name="GroupChat" component={GroupChat} options={{ headerShown: false }} />
          <Stack.Screen name="ProfilePage" component={ProfilePage} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
