var slapp = require('../init');

// Configure cookies jar for use in other modules

let j = request.jar();
let url = "http://kanobu.ru/shouts/add"
j.setCookie(request.cookie('csrftoken=' + process.env.CSRF_TOKEN), url);
j.setCookie(request.cookie('probtnid=' + process.env.PROBTN_ID), url);
j.setCookie(request.cookie('gsid=' + process.env.GS_ID), url);

module.exports = j;
