'use strict'

module.exports = {
	header:{
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
},
  api:{
  	base: 'http://rap.taobao.org/mockjs/13144/',
  	creations: 'api/creations',
  	up: 'api/up',
    comment: 'api/comments'
  }
}
