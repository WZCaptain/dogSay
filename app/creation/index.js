// import React from 'react';
import React, { Component } from 'react';
import Icon  from 'react-native-vector-icons/Ionicons'
// import Mock from 'mockjs'
import request from '../common/request'
import config from '../common/config'
import Detail from './detail'
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableHighlight,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  AlertIOS
} from 'react-native';

// ES5
// var React = require('react')
// var ReactNative = require('react-native')
// var Mock = require('mockjs')
// var request = require('../common/request')
// var config = require('../common/config')
// var Detail = require('./detail')
// var Icon = require('react-native-vector-icons/Ionicons')

// var StyleSheet = ReactNative.StyleSheet
// var Text = ReactNative.Text
// var View = ReactNative.View
// var ListView = ReactNative.ListView
// var Image = ReactNative.Image
// var TouchableHighlight = ReactNative.TouchableHighlight
// var Dimensions = ReactNative.Dimensions
// var ActivityIndicator = ReactNative.ActivityIndicator
// var RefreshControl = ReactNative.RefreshControl
// var AlertIOS = ReactNative.AlertIOS



var width = Dimensions.get('window').width

var cashedResults = {
  nextPage: 1,
  items: [],
  total: 0
}

var Item = React.createClass({
  getInitialState() {
    var row = this.props.row

    return {
      up: row.voted,
      row: row
      }
  },

  _up() {
    var that = this
    var up = !this.state.up
    var row = this.state.row
    var url = config.api.base + config.api.up

    var body ={
      id: row._id,
      up: up ? 'yes' : 'no',
      accessToken : 'abc'
    }

    request.post(url,body)
      .then((data) => {
        if (data && data.success) {
          that.setState({
            up: up
          })
        }else {
          AlertIOS.alert('点赞失败，稍后重试')
        }
      })
      .catch((err) => {
          console.log(err)
            AlertIOS.alert('点赞失败，稍后重试')
        })
  },

  render() {
    var row = this.props.row
    return (
      <TouchableHighlight onPress={this.props.onSelect}>
      <View style={styles.item}>
        <Text style={styles.title}>{row.title}</Text>
         <Image source={{uri: row.thumb}} style={styles.thumb} />
         <Icon name='ios-play' 
               size={28} 
               style={styles.play} />
         <View style={styles.itemFooter}>
          <View style={styles.handleBox}>
            <Icon name={this.state.up ? 'ios-heart' : 'ios-heart-outline' }
                  size={28}
                  onPress={this._up} 
                  style={[styles.up, this.state.up ? null : styles.down]} />
            <Text style={styles.handleText} onPress={this._up}>喜欢</Text>
          </View>
          <View style={styles.handleBox}>
            <Icon name='ios-chatboxes-outline' size={28} style={styles.commentIcon} />
            <Text style={styles.handleText}>评论</Text>
          </View>
         </View>
      </View>
     </TouchableHighlight>
      )
  }
})

var List = React.createClass({

  getInitialState() {
  var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

  return {
    isRefreshing: false, 
    isLoadingTail: false,
    dataSource: ds.cloneWithRows([]),
  }

},

	_renderRow(row){
		return <Item 
        key={row._id} 
        onSelect={() => this._loadPage(row)} 
        row={row} />
	},

  componentDidMount() {
    this._fetchData(1)

    var numberArray = [1,2,3,4,5]

    // var newNumberArray = numberArray.map(function(item){
    //   return item + 1
    // })

    var newNumberArray = numberArray.map(item => item + 1)

    console.log(newNumberArray)
  },

  _fetchData(page){ // _fetchData 私有方法
    var that = this

    if (page !== 0) {
      this.setState({
      isLoadingTail: true
    })
    }else{
      this.setState({
      isRefreshing: true
    })
    }
    
    request.get(config.api.base +  config.api.creations,{
      accessToken: 'abc',
      page: page
    })
      .then((data) => {
        if (data.success){
          var items = cashedResults.items.slice()

          if (page !== 0){
            items = items.concat(data.data)
            cashedResults.nextPage += 1
          }else {
            items = data.data.concat(items)
          }
          
          cashedResults.items = items
          cashedResults.total = data.total

          setTimeout(function(){
            if (page !== 0) {
              that.setState({
                isLoadingTail: false,
                dataSource: that.state.dataSource.cloneWithRows(cashedResults.items)
              })
            }else{
              that.setState({
                isRefreshing: false,
                dataSource: that.state.dataSource.cloneWithRows(cashedResults.items)
              })
            }
          }, 200)
        }
    })
    .catch((error) => {
      if (page !== 0) {
        this.setState({
        isLoadingTail: false
        })
      }else{
        this.setState({
        isRefreshing: false
        })
      }
      console.warn(error);
    })
  },

  _hasMore() {
    return cashedResults.items.length !== cashedResults.total
  },

  _fetchMoreData() {
    if (!this._hasMore() || this.state.isLoadingTail) {
      return 
    }
    var page = cashedResults.nextPage
    this._fetchData(page)
  },

  _onRefresh() {
    if (!this._hasMore() || this.state.isRefreshing){
      return
    }
    this._fetchData(0)
  },

  _renderFooter() {
    if(!this._hasMore() && cashedResults.total !== 0){
      return (
          <View style={styles.loadingMore}>
            <Text style={styles.loadingText}>没有更多了</Text>
          </View>
        )
    }

    if (this.state.isLoadingTail) {
      return <View style={styles.loadingMore} />
    }

    return <ActivityIndicator style={styles.loadingMore} /> 
  },

  _loadPage(row) {
    this.props.navigator.push({
      name: 'detail',
      Component: Detail,    //注意大写 Component
      params: {
        data: row
      }
    })
  },

  render(){
    return (
      <View style={styles.container}>
      	<View style={styles.header}>
      		<Text style={styles.headerTitle}>列表页面</Text>
      	</View>
      	<ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderFooter={this._renderFooter}
          onEndReached={this._fetchMoreData}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              tintColor='#ff6600'
              title='拼命加载中...'
              titleColor='#ff6600'
            />
        }
          onEndReachedThreshold={20}   //调用onEndReached之前的临界值，单位是像素
          enableEmptySections={true}
          showsVerticalScrollIndicator={false}  //隐藏纵向滚动条
          automaticallyAdjustContentInsets={false}
        />
      </View>
      )
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  header:{
  	 paddingTop: 25,
  	 paddingBottom: 12,
  	 backgroundColor: '#ee735c'
  },

  headerTitle:{
  	 color: '#fff',
  	 fontSize: 16,
  	 textAlign: 'center',
  	 fontWeight: '600'
  },

  item:{
  	width: width,
  	marginBottom: 10,
  	backgroundColor: '#fff'
  },

  title:{
  	padding: 10,
  	fontSize: 18,
  	color: '#333'
  },

  thumb:{
  	width: width,
  	height : width * 0.56,
  	resizeMode: 'cover'
  },

  itemFooter:{
  	flexDirection: 'row',
  	justifyContent: 'space-between',
  	backgroundColor: '#eee'
  },

  handleBox:{
  	padding: 10,
  	flexDirection: 'row',
  	width: width / 2 - 0.5,
  	justifyContent: 'center',
  	backgroundColor: '#fff'
  },

  play:{
  	position: 'absolute',
  	bottom: 60,
  	right: 14,
  	width: 46,
  	height: 46,
  	paddingTop: 9,
  	paddingLeft: 18,
  	backgroundColor: 'transparent',
  	borderColor: '#fff',
  	borderWidth: 1,
  	borderRadius: 23,
  	color: '#ed7b66'
  },

  handleText: {
  	paddingLeft: 12,
  	fontSize: 18,
  	color: '#333'
  },

  down: {
  	fontSize: 22,
  	color: '#333'
  },

  up: {
    fontSize: 22,
    color: '#ed7b66'
  },

  commentIcon: {
  	fontSize: 22,
  	color: '#333'
  },

  loadingMore: {
    marginVertical: 20
  },

  loadingText: {
    color: '#777',
    textAlign: 'center'
  }
});

module.exports = List