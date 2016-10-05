var slapp = require('./init');

slapp.message('.*(help|помоги).*', ['mention'], (msg) => {
  msg.say('Чем помочь?');
});
