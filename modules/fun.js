// just a bunch of random "fun" stuff

var slapp = require('./init');

slapp.message('^попрошу.*', ['mention'], (msg) => {
    msg.say(":oldfag::tophat:\n:point_up::peka::wine_glass:");
})
