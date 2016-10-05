'use strict'
const express = require('express');
const Slapp = require('slapp');
const ConvoStore = require('slapp-convo-beepboop')
const BeepBoopContext = require('slapp-context-beepboop')
if(!process.env.PORT) throw Error('PORT is missing but required')

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

slapp.message('^(hi|hello|\:wave\:|привет|хэй).*', ['mention'], (msg) => {
  msg.say('Да-да... Я тут... Хотел чего-то?').route('handleRequest', 60);
});

slapp.route('handleRequest', (msg) => {
    let test  = ["топ", "рейтинг", "top", "лидерборд"];
    if (new RegExp(test.join('|')).test(msg.body.event.text)) {
        msg.say('Лагуна все еще лучший ¯\\_(ツ)_/¯');
        return
    } else {
        msg.say('Ну и ладно');
        return
    }
})

/*
 *  END OF SLAPP
 */

app.get('/', function(req, res) {
    res.send('Alive!');
});

app.listen(process.env.PORT);
console.log('Express server listening on port ' + process.env.PORT);
