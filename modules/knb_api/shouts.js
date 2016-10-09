// Post shouts from orels1 user
var slapp = require('../init');
const knbapi = require('./api');

// ask for the shout
slapp.message('.*напиши вопль.*', ['mention', 'direct_message'], (msg) => {
    if (msg.body.event.user != process.env.ADMIN_USER) {
        // check if used by an admin
        msg.say('Извини, но постить вопли может только админ бота');
        return
    } else {
        // ask for the text
        msg.say('Что написать?').route('sendShout', 60);
    }
})

slapp.route('sendShout', (msg) => {
    // check if is a text message
    if (msg.body.event.type != 'message') {
        msg.say('Пожалуйста, напиши текст').route('sendShout', 60);
        return
    // check if message fits
    } else if (msg.body.event.text.length > 256) {
        msg.say('Извини, текст слишком длинный, постарайся убрать '
                + (msg.body.event.text.length - 256) + 'символов')
        .route('sendShout', 60);
        return
    } else {
        // send shout
        knbapi.sendShout(msg.body.event.text, (status, err) => {
            if (err) {
                // if crashed - ask for retry
                msg.say('Что-то пошло не так, попробуем еще раз? (да/нет/+/-)')
                .route('shoutRetry', 60);
            } else if (status == 'fail') {
                // if request was good, but something went wrong
                msg.say('Канобу вернул ошибку, попробуем еще раз? (да/нет/+/-)')
                .route('shoutRetry', 60);
                return
            } else {
                // if everything is good - success
                msg.say('Вопль успешно отправлен ^^');
                return
            }
        })

    }
});

// retry handle
slapp.route('shoutRetry', (msg) => {
    // check if message, and if it is - check if it has correct format
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
