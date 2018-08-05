import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation'
import HomeScreen from './pages/HomeScreen'
import SuccessSignIn from './pages/SuccessSignIn'

class Application extends Component {
  render = () => {
    return (
      <View style={{flex:1}}>
        <ApplicationScreen
        uriPrefix={prefix}/>
      </View>
    );
  }
}

const prefix = Platform.OS == 'android' ? 'myapp://myapp/' : 'myapp://'

const ApplicationScreen = createStackNavigator({
  HomeScreen: {
    screen: HomeScreen,
  },
  SuccessSignIn: {
    screen: SuccessSignIn,
    path: 'success/'
  }
}, {
  initialRouteName: 'HomeScreen',
  navigationOptions: {
    header : null
  },
})

export default Application