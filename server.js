'use strict'
var express = require('express');
var Slapp = require('slapp');
var ConvoStore = require('slapp-convo-beepboop')
var BeepBoopContext = require('slapp-context-beepboop')

/*
 *  SLAPP
 */

// init
var slapp = Slapp({
    convo_store: ConvoStore(),
    context: BeepBoopContext()
});


// attach to a server
var app = slapp.attachToExpress(express());

// do stuff

slapp.message('hi (.*)', ['mention'], (msg) => {
  msg.say('Yeah yeah... I\'m here');
});

/*
 *  END OF SLAPP
 */

app.get('/', function(req, res) {
    res.send('Alive!');
});

app.listen(process.env.PORT);
console.log('Express server listening on port ' + process.env.PORT);
