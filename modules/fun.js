// just a bunch of random "fun" stuff

var slapp = require('./init');

slapp.message('^попрошу.*', ['mention'], (msg) => {
    msg.say(":oldfag::tophat:\n:point_up::peka::wine_glass:");
})

slapp.message('^Поздоровайся.*', ['mention'], (msg) => {
    msg.say("Привет! Я могу помочь освоиться с нашими инструментами. Просто напиши \"@cardinal помоги\" и я сделаю все, что в моих силах :)");
})
