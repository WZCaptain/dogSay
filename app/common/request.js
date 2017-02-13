'use strict'

var queryString = require('query-string')
var _ = require('lodash')
var Mock = require('mockjs')
var request = {}
var config = require('./config')

request.get = function(url, params){
  if (params) {
    url += '?' + queryString.stringify(params)
  }

  return fetch(url)
    .then((response) => response.json())
    .then((response) => Mock.mock(response))
}

request.post = function(url, body){
  var options = _.extend(config.header,{
    body: JSON.stringify(body)
  })

  return fetch(url, options)
    .then((response) => response.json())
    .then((response) => Mock.mock(response))
}

module.exports = request






// _fetchData(){ // _featchData 私有方法
//     fetch('http://rap.taobao.org/mockjs/13144/api/creations/?accessToken=abc')
//       .then((response) => response.json())
//       .then((response) => {
//         var data = Mock.mock(response)

//         if (data.success){
//           this.setState({
//             dataSource: this.state.dataSource.cloneWithRows(data.data)
//           })
//         }
//         console.log(data)
//     })
//     .catch((error) => {
//       console.warn(error);
//     })
//   }