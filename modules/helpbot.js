var slapp = require('./init');

slapp.message('.*(help|помоги).*', ['mention'], (msg) => {
  msg.say('Чем помочь?').route('searchHelp');
});

slapp.route('searchHelp', (msg) => {
    let test = new RegExp(["фичер", "тест", "викторин", "гиф"].join('\S*|'));
    if (test.test(msg.body.event.text)) {
        let result = test.exec(msg.body.event.text);
        let response;

        // Options go here for time being
        // TODO: Do something about that. Better move to a .json file
        switch (result[0]) {
            case 'фичер':
                response = {
                    "Как поставить фичер" : "http://kanobu.ru/guidelines/#user-content-Редакционный-фичер",
                    "Какие размеры у картинок": "http://kanobu.ru/guidelines/#user-content-Редакционный-фичер",
                    "Рекомендации по подбору картинок": "http://kanobu.ru/guidelines/#user-content-Общие-рекомендации",
                    "Что такое концентрированный фичер": "http://kanobu.ru/guidelines/#user-content-Концентрированный-фичер",
                    "Примеры": "http://kanobu.ru/guidelines/#user-content-Гифки"
                };
                break
            case 'тест':
            case 'викторин':
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
            case 'гиф':
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
        Object.keys(response).forEach((item, index) => {
            options.push({
                text: item,
                callback_id: 'section_select',
                actions: [
                    {
                        "name": item,
                        "text": "Выбрать",
                        "type": "button",
                        "value": response[item]
                    }
                ]
            });
        });
        msg.say({
            text: "Хорошо, но давай уточним. Что именно тебя интересует?",
            attachments: options
        }).route('selectTopic', 60);
        return

    } else {
        msg.say('К сожалению, я не могу с этим помочь :cold_sweat:');
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
