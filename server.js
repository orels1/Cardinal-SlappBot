'use strict'
const express = require('express');
const request = require('request');
//if(!process.env.PORT) throw Error('PORT is missing but required')

/*
 *  SLAPP
 */

// init
var slapp = require('./modules/init');


// attach to a server
var app = slapp.attachToExpress(express());
app.set('port', process.env.PORT || 3000);

// debug
// slapp.use((msg, next) => {
//   console.log(msg)
//   next()
// })

// Module system
const helpbot = require('./modules/helpbot');
const fun = require('./modules/fun');

// do stuff

/*
 *  END OF SLAPP
 */

app.get('/', function(req, res) {
    res.send('Alive!');
});

// Debug some stuff here

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
