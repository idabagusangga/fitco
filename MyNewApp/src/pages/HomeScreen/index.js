import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Linking,
  Button,
  UIManager, LayoutAnimation, Alert
} from 'react-native';
import { authorize } from 'react-native-app-auth';
import qs from 'qs'

const config = {
  clientId: '22CXLN',
  clientSecret: 'bcddaffdca56ec5f802fa2bc8b4a26f1',
  redirectUrl: 'myapp://myapp/', //note: path is required
  scopes: ['activity', 'sleep'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://www.fitbit.com/oauth2/authorize',
    tokenEndpoint: 'https://api.fitbit.com/oauth2/token',
    revocationEndpoint: 'https://api.fitbit.com/oauth2/revoke'
  }
};


function OAuth(client_id, cb) {
  console.log('masuk OAuth')
  // Listen to redirection
 Linking.addEventListener('url', handleUrl);
 function handleUrl(event){
   Linking.removeEventListener('url', handleUrl);
   const [, query_string] = event.url.match(/\#(.*)/);
   console.log(query_string);
 
   const query = qs.parse(query_string);
   console.log(`query: ${JSON.stringify(query)}`);

   cb(query.access_token);
 }
 
 
  // Call OAuth
 const oauthurl = 'https://www.fitbit.com/oauth2/authorize?'+
           qs.stringify({
             client_id,
             response_type: 'token',
             scope: 'heartrate activity activity profile sleep',
             redirect_uri: 'myapp://myapp/',
             expires_in: '31536000',
             //state,
           });
 console.log(oauthurl);
 Linking.openURL(oauthurl).catch(err => console.error('Error processing linking', err));
 }
 
 //get your API data
 function getData(access_token) {
  console.log(access_token)
 fetch(
    'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json',
   {
     method: 'GET',
     headers: {
       'Authorization': `Bearer ${access_token}`
     },
    //  body: `root=auto&path=${Math.random()}`
 
   }
 ).then((res) => {
   return res.json()
 }).then((res) => {
   console.log('masuk sini')
   console.log(`res: ${JSON.stringify(res)}`);
 }).catch((err) => {
   console.error('Error: ', err);
 });
 }




export default class HomePage extends Component{


componentDidMount() {
  Linking.getInitialURL().then((url) => {
    if (url) {
      console.log('Initial url is: ' + url);
    }
  }).catch(err => console.error('An error occurred', err));
}



  initFitBit = async () => {
    try {
      console.warn("authentication-start")
      const response = await authorize(config)
      Alert.alert(response);
      
    }
    catch (error) {
      Alert.alert('Failed to log in', error.message);
    }
    // authorize(config)
    // .then(response => {
    //   console.warn('masuk sini')
    //   console.warn(response)
    // })
    // .catch(err => {
    //   console.warn(err)
    // })
  }


  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.welcome}>
        Welcome to React Native!
      </Text>
      <Text>
        To get started, edit App.js
      </Text>
      <Text>
        test fitbit
      </Text>
      <Button onPress={() => OAuth('22CXLN', getData)} title="Sign in to FitBit"/>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
