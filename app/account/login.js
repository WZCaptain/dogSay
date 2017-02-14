import React from 'react';
import Icon  from 'react-native-vector-icons/Ionicons'
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

// var React = require('react')
// var ReactNative = require('react-native')
// var Icon = require('react-native-vector-icons/Ionicons')
// var StyleSheet = ReactNative.StyleSheet
// var Text = ReactNative.Text
// var View = ReactNative.View


var Login = React.createClass({
  render(){
    return (
      <View style={styles.container}>
        <Text>账户页面</Text>
      </View>
      )
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  
});

module.exports = Login