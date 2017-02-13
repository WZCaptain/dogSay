/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React , { Component } from 'react';
import Icon  from 'react-native-vector-icons/Ionicons'
import {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  Navigator
} from 'react-native';

// var React = require('react')
// var ReactNative = require('react-native')
// var Icon = require('react-native-vector-icons/Ionicons')
// var Component = React.Component
// var AppRegistry = ReactNative.AppRegistry
// var StyleSheet = ReactNative.StyleSheet
// var Text = ReactNative.Text
// var View = ReactNative.View
// var TabBarIOS = ReactNative.TabBarIOS
// var Navigator = ReactNative.Navigator


var List = require('./app/creation/index')

var Edit = require('./app/edit/index')

var Account = require('./app/account/index')

var dogSay = React.createClass({

  getInitialState() {
    return {
      selectedTab: 'list',
      notifCount: 0,
      presses: 0,
    };
  },

  render() {
    return (
      <TabBarIOS
        unselectedTintColor="yellow"
        tintColor="#ee735c" 
      >
        <Icon.TabBarItemIOS
          iconName='ios-videocam-outline'
          selectedIconName='ios-videocam'
          selected={this.state.selectedTab === 'list'}
          onPress={() => {
            this.setState({
              selectedTab: 'list',
            });
          }}>
          <Navigator 
            initialRoute={{
              name: 'list',
              Component: List
            }}
            configureScene={(route) => {
              return Navigator.SceneConfigs.FloatFromRight
            }}
            renderScene={(route, navigator) => {
              let MySceneComponent = route.Component

              return <MySceneComponent {...route.params} navigator={navigator} />
            }}
          />
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          iconName='ios-recording-outline'
          selectedIconName='ios-recording'
          badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
          selected={this.state.selectedTab === 'edit'}
          onPress={() => {
            this.setState({
              selectedTab: 'edit',
              notifCount: this.state.notifCount + 1,
            });
          }}>
          <Edit/>
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          iconName='ios-more-outline'
          selectedIconName='ios-more'
          selected={this.state.selectedTab === 'account'}
          onPress={() => {
            this.setState({
              selectedTab: 'account',
              presses: this.state.presses + 1
            });
          }}>
          <Account/>
        </Icon.TabBarItemIOS>
      </TabBarIOS>
    );
  }

});

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

AppRegistry.registerComponent('dogSay', () => dogSay);
