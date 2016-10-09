// Post shouts from orels1 user
var slapp = require('../init');
const knbapi = require('./api');

// ask for the feature
slapp.message('.*поставь фичер.*', ['mention', 'direct_message'], (msg) => {
    // ask for the text
    msg.say('Хорошо, давай ссылку на материал').route('getFeatureLink', 60);
});

slapp.route('getFeatureLink', (msg) => {
    console.log('message');
    if (msg.body.event.type != 'message') {
        msg.say('Пожалуйста, пришли только ссылку').route('getFeatureLink', 60);
        return
    } else if (msg.body.event.text.indexOf('http') == -1) {
        msg.say('Ссылка должна начинаться с http/https').route('getFeatureLink', 60);
        return
    } else {
        // get the longread ID: portion from last '-' to the '/'
        let text = msg.body.event.text;
        let longread = text.substr(
                text.lastIndexOf('-') + 1,
                text.lastIndexOf('/') - text.lastIndexOf('-') - 1);

        let state = {
            longread: longread
        };

        msg.say('Отлично, номер материала \`' + longread + '`\nКакой будет заголовок?')
        .route('getFeatureTitle', state, 60);
        return
    }
});

slapp.route('getFeatureTitle', (msg, state) => {
    if (msg.body.event.type != 'message') {
        msg.say('Пожалуйста, пришли только заголовок').route('getFeatureTitle', state, 60);
        return
    } else {
        let text = msg.body.event.text;

        // assign to the whole object
        state.title = text;

        msg.say('Отлично, заголовок фичера:\n*' + text + '*\nКакой будет подзаголовок?')
        .route('getFeatureSubTitle', state, 60);
        return
    }
});

slapp.route('getFeatureSubTitle', (msg, state) => {
    if (msg.body.event.type != 'message') {
        msg.say('Пожалуйста, пришли только подзаголовок').route('getFeatureSubTitle', state, 60);
        return
    } else {
        let text = msg.body.event.text;

        // assign to the whole object
        state.subtitle = text;

        msg.say('Отлично, подзаголовок фичера:\n*' + text + '*\nКакого размера будет фичер? (1/2/3)')
        .route('getFeatureSize', state, 60);
        return
    }
});

slapp.route('getFeatureSize', (msg, state) => {
    if (msg.body.event.type != 'message') {
        msg.say('Пожалуйста, выбери размер фичера: 1/2/3').route('getFeatureSize', state, 60);
        return
    } else {
        let text = msg.body.event.text;

        // assign to the whole object
        state.size = text;

        // compose check-message
        let message = `
    Супер! Давай проверим.
    Мы ставим в фичер лонгрид с id *` + state.longread + `*
    С заголовком *` + state.title + `*
    С подзаголовком *` + state.subtitle + `*
    Размером *` + state.size + `*

    Все верно? (да/нет/+/-)
        `;

        msg.say(message)
        .route('addFeature', state, 60);
        return
    }
});

slapp.route('addFeature', (msg, state) => {
    // check if is a text message
    if (msg.body.event.type != 'message') {
        msg.say('Пожалуйста используй ответы: да/нет/+/-').route('addFeature', state, 60);
        return
    } else if (msg.body.event.text == 'нет' || msg.body.event.text == '-') {
        msg.say('Жаль :slightly_frowning_face: напиши _*поставь фичер*_, если хочешь попробовать снова')
        return
    } else if (msg.body.event.text == 'да' || msg.body.event.text == '+') {
        // send shout
        knbapi.addFeature(state.title, state.subtitle, state.longread, state.size, 'test.jpg', 0, 'on',
            (status, err) => {
            if (err) {
                // if crashed - ask for retry
                msg.say('Что-то пошло не так, попробуем еще раз? (да/нет/+/-)')
                .route('addFeature', state, 60);
            } else if (status == 'fail') {
                // if request was good, but something went wrong
                msg.say('Канобу вернул ошибку, попробуем еще раз? (да/нет/+/-)')
                .route('addFeature', state, 60);
                return
            } else {
                // if everything is good - success
                msg.say('Фичер успешно поставлен ^^');
                return
            }
        })

    } else {
        msg.say('Пожалуйста используй ответы: да/нет/+/-').route('addFeature', state, 60);
        return
    }
});
