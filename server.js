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

// do stuff

slapp.message('^попрошу.*', ['mention'], (msg) => {
    msg.say(":oldfag::tophat:\n:point_up::peka::wine_glass:");
})

slapp.message('.*напиши вопль.*', ['mention', 'direct_message'], (msg) => {
    msg.say('Что написать?').route('sendShout', 60);
})

slapp.route('sendShout', (msg) => {
    if (msg.body.event.type != 'message') {
        msg.say('Пожалуйста, напиши текст').route('sendShout', 60);
        return
    } else if (msg.body.event.text.length > 256) {
        msg.say('Извини, текст слишком длинный, постарайся убрать '
                + (msg.body.event.text.length - 256) + 'символов')
        .route('sendShout', 60);
        return
    } else {
        // Configure form-data for shouts
        let formData = {
            'style': 'tiny',
            'cry-text': msg.body.event.text,
            'cry_path': '/'
        }

        // Configure cookies, those will need to be updated from time to time,
        // but they are pretty liberal

        let j = request.jar();
        let url = "kanobu.ru"
        j.setCookie(request.cookie('csrftoken=' + process.env.CSRF_TOKEN), url);
        j.setCookie(request.cookie('probtnid=' + process.env.PROBTN_ID), url);
        j.setCookie(request.cookie('gsid=' + process.env.GS_ID), url);

        request.post({url: 'http://kanobu.ru/shouts/add/', jar: j, formData: formData},
            (err, response, body) => {
                if (err) {
                    // if crashed - ask for retry
                    msg.say('Что-то пошло не так, попробуем еще раз? (да/нет/+/-)')
                    .route('shoutRetry', 60);
                    return console.error('posting failed', err);
                } else if (response.statusCode != 200) {
                    // if request was good, but something went wrong
                    console.log(body);
                    msg.say('Канобу вернул ошибку, попробуем еще раз? (да/нет/+/-)')
                    .route('shoutRetry', 60);
                    return
                } else {
                    // if everything is good
                    msg.say('Вопль успешно отправлен ^^');
                    return
                }
            })
    }
});

// retry handle
slapp.route('shoutRetry', (msg) => {
    if (msg.body.event.type != 'message') {
        msg.say('Пожалуйста, используй да/нет/+/-').route('shoutRetry', 60);
        return
    } else if (msg.body.event.text == 'да' || msg.body.event.text == '+') {
        msg.say('Хорошо, что напишем?')
        .route('sendShout', 60);
        return
    } else if (msg.body.event.text == 'нет' || msg.body.event.text == '-') {
        msg.say('Хорошо, не будем ничего писать');
        return
    } else {
        msg.say('Пожалуйста, используй да/нет/+/-').route('shoutRetry', 60);
        return
    }
})

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
