'use strict'
const express = require('express');
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

// do stuff

slapp.message('^попрошу.*', ['mention'], (msg) => {
    msg.say(":oldfag::tophat:\n:point_up::peka::wine_glass:");
})

/*
 *  END OF SLAPP
 */

app.get('/', function(req, res) {
    res.send('Alive!');
});

// Debug some stuff here

console.log('Tokens will go next\n',
            'CSRF_TOKEN', process.env.CSRF_TOKEN,
            'PROBTN_ID', process.env.PROBTN_ID,
            'GS_ID', process.env.GS_ID);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
