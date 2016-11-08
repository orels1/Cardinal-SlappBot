var slapp = require('./init');

slapp.message('.*(help|помоги).*', ['mention', 'direct_message'], (msg) => {
    msg.say({
        text: 'Чем помочь?',
        attachments: [{
            text: "",
            callback_id: 'section_select',
            actions: [
                { "name": "section", "text": "Фичеры", "type": "button", "value": "features" },
                { "name": "section", "text": "Викторины / Тесты", "type": "button", "value": "tests" },
                { "name": "section", "text": "Гифки", "type": "button", "value": "gifs" }
            ]
        }]
    })
    .route('searchHelp', 10);
});

slapp.route('searchHelp', (msg) => {
    if (msg.type !== 'action') {
        if (msg.body.event.text.toLowerCase().indexOf('стоп') != -1) {
            msg.say('Хорошо, молчу :(');
            return;
        } else {
            msg.say('Пожалуйста, выбери вариант из списка выше :wink: \n Или напиши "стоп", чтобы отменить поиск :no_entry:')
            .route('searchHelp', 10);
            return
        }
    } else {

        // Options go here for time being
        // TODO: Do something about that. Better move to a .json file
        switch (msg.body.actions[0].value) {
            case 'features':
                response = {
                    "Как поставить фичер" : "http://kanobu.ru/guidelines/#user-content-Редакционный-фичер",
                    "Какие размеры у картинок": "http://kanobu.ru/guidelines/#user-content-Редакционный-фичер",
                    "Рекомендации по подбору картинок": "http://kanobu.ru/guidelines/#user-content-Общие-рекомендации",
                    "Что такое концентрированный фичер": "http://kanobu.ru/guidelines/#user-content-Концентрированный-фичер",
                    "Примеры": "http://kanobu.ru/guidelines/#user-content-Гифки"
                };
                break
            case 'tests':
                response = {
                    "Типы викторин": "http://kanobu.ru/guidelines/#user-content-Викторины-тесты",
                    "Как сделать текстовую викторину": "http://kanobu.ru/guidelines/#user-content-Текстовые-викторины-тесты",
                    "Как сделать визуальную викторину": "http://kanobu.ru/guidelines/#user-content-Визуальные-викторины-тесты",
                    "Как сделать аудио-викторину": "http://kanobu.ru/guidelines/#user-content-Аудио-викторины-тесты",
                    "Как сделать викторину «Узнай, кто ты»": "http://kanobu.ru/guidelines/#user-content-Викторина-Узнай,-кто-ты",
                    "Как добавить викторину в статью": "http://kanobu.ru/guidelines/#user-content-Публикация",
                    "Примеры": "http://kanobu.ru/guidelines/#user-content-Общие-моменты"
                };
                break
            case 'gifs':
                response = {
                    "Как сделать гифку из видео": "http://kanobu.ru/guidelines/#user-content-Гифки",
                    "Требования к размерам и весу гифок на сайте": "http://kanobu.ru/guidelines/#user-content-Гифки",
                    "Как облегчить гифку": "http://kanobu.ru/guidelines/#user-content-Гифки",
                    "Где искать гифки": "http://kanobu.ru/guidelines/#user-content-Гифки",
                    "Примеры": "http://kanobu.ru/guidelines/#user-content-Гифки"
                };
                break
            default:
                msg.say(':round_pushpin: Что-то пошло не так :cold_sweat:');
                return
                break
        }

        // Build attachments
        let options = [];
        // text first
        Object.keys(response).forEach((item, index) => {
            options.push({
                text: (index + 1) + '. ' + item
            });
        });

        // then buttons
        options.push({
            text: "",
            callback_id: 'section_select',
            actions: []
        });
        Object.keys(response).forEach((item, index) => {
            options[options.length-1].actions.push({
                "name": item,
                "text": index + 1,
                "type": "button",
                "value": response[item]
            });
        });

        // if there are more than 5 buttons - build another raw (Slack limits)
        if (Object.keys(response).length > 5) {
            options.push({
                text: "",
                callback_id: 'section_select',
                actions: []
            });
            Object.keys(response).forEach((item, index) => {
                if (index > 4) {
                    options[options.length-1].actions.push({
                        "name": item,
                        "text": index + 1,
                        "type": "button",
                        "value": response[item]
                    });
                }
            });
        }

        msg.respond(msg.body.response_url, {
            text: "Хорошо, но давай уточним. Что именно тебя интересует?",
            attachments: options,
            delete_original: true
        }).route('selectTopic', 60);
        return

    }
});

slapp.route('selectTopic', (msg) => {
    if (msg.type !== 'action') {
        msg.say('Пожалуйста, выбери вариант из списка выше :wink:')
        .route('selectTopic', 60);
        return
    } else {
        msg.respond(msg.body.response_url, {
            text: 'Окей, ответ ждет тебя тут\n' + msg.body.actions[0].value,
            delete_original: true
        });
        return
    }
});
