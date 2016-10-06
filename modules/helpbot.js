var slapp = require('./init');

slapp.message('.*(help|помоги).*', ['mention'], (msg) => {
  msg.say('Чем помочь?').route('searchHelp');
});

slapp.route('searchHelp', (msg) => {
    let test = new RegExp(["фичер", "тест", "викторин", "гиф"].join('\S*|'));
    if (test.test(msg.body.event.text)) {
        let result = test.exec(msg.body.event.text);
        console.log('Result', result);
        let state = { section: result[0] };
        msg.say('Хорошо, но давай уточним').route('sectionSelect', state, 60);
        return
    } else {
        msg.say('К сожалению, я не могу с этим помочь :cold_sweat:');
        return
    }
});

slapp.route('sectionSelect', (msg, state) => {
    let response;

    switch (state.section) {
        case 'фичер':
            response = [
                "Как поставить фичер",
                "Какие размеры у картинок",
                "Рекомендации по подбору картинок",
                "Что такое концентрированный фичер",
                "Примеры"
            ];
            break
        case 'тест':
        case 'викторин':
            response = [
                "Типы викторин",
                "Как сделать текстовую викторину",
                "Как сделать визуальную викторину",
                "Как сделать аудио-викторину",
                "Как сделать викторину «Узнай, кто ты»",
                "Как добавить викторину в статью",
                "Примеры"
            ];
            break
        case 'гиф':
            response = [
                "Как сделать гифку из видео",
                "Требования к размерам и весу гифок на сайте",
                "Как облегчить гифку",
                "Где искать гифки",
                "Примеры"
            ];
            break
        default:
            msg.say(':round_pushpin: Что-то пошло не так :cold_sweat:');
            break;

        let options = [];
        response.forEach((item, index) => {
            options.push({
                text: index + '. ' + item
            });
        });

        console.log('Response', response, 'Options', options);

        msg.say({
            text: "Что именно тебя интересует?",
            attachments: options
        });

    }
})
