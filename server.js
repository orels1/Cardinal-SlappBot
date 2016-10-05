'use strict'
const express = require('express');
const Slapp = require('slapp');
const ConvoStore = require('slapp-convo-beepboop')
const BeepBoopContext = require('slapp-context-beepboop')
const logger = require('morgan');
//if(!process.env.PORT) throw Error('PORT is missing but required')

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
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));

// debug
// slapp.use((msg, next) => {
//   console.log(msg)
//   next()
// })

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
});

slapp.message("бот, ешь картинку", (msg) => {
    msg.say('Не хочу >.<').route('handleImageUpload');
});

slapp.route('handleImageUpload', (msg) => {
    if (msg.body.event.subtype = "file_share") {
        msg.say({
            text: "Я тож так могу",
            attachments: [
                {
                    text: "",
                    image_url: msg.body.event.file.permalink
                }
            ]
        });
    }

});

/*
 *  END OF SLAPP
 */

app.get('/', function(req, res) {
    res.send('Alive!');
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
