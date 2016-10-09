// Post shouts from orels1 user
var slapp = require('../init');

// grab pre-built cookies jar
const knbauth = require('./modules/knb_api/knbauth');

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

        // Configure form-data for shouts
        let formData = {
            'style': 'tiny',
            'cry-text': msg.body.event.text,
            'cry_path': '/'
        }

        // grab pre-configured cookie jar
        let j = knbauth;

        // send the request with all the cookies and the CSRF header
        request.post({
            url: 'http://kanobu.ru/shouts/add/',
            jar: j,
            formData: formData,
            headers: {
                'X-CSRFToken': process.env.CSRF_TOKEN
            }
        },
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
