const Slapp = require('slapp');
const ConvoStore = require('slapp-convo-beepboop')
const BeepBoopContext = require('slapp-context-beepboop')

var slapp = Slapp({
    convo_store: ConvoStore(),
    context: BeepBoopContext()
});

module.exports = slapp;
