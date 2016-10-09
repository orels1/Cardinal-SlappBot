// KNB "Fake" api

const request = require('request');
const knbauth = require('./knbauth');

// Here we will make a "wrapper" for the most of the needed places

class KnbApi {
    constructor() {
        this.csrf = process.env.CSRF_TOKEN;
        this.cookies = knbauth;
        this.base = "http://kanobu.ru/"
    }

    // main send function
    static sendToApi(url, data, cb) {
        // grab pre-configured cookie jar
        let j = knbauth;

        // send the request with all the cookies and the CSRF header
        request.post({
            url: url,
            jar: j,
            formData: formData,
            headers: {
                'X-CSRFToken': this.csrf
            }
        }, (err, response, body) => {
            if (err) {
                // if crashed - ask for retry
                cb('err', err);
            } else if (response.statusCode != 200) {
                // if request was good, but something went wrong
                cb('fail')
            } else {
                // if everything is good - success
                cb('ok');
            }
        })
    }

    // sends shout
    static sendShout(text, cb) {
        // Configure form-data for shouts
        let formData = {
            'style': 'tiny',
            'cry-text': text,
            'cry_path': '/'
        }

        let url = this.base + 'shouts/add/';
        this.sendToApi(url, formData, cb);
    }

    // creates features
    static addFeature(title, subtitle, longread, size, image, position, active, cb) {
        // Configure form-data for feature
        let formData = {
            'csrfmiddlewaretoken': this.csrf,
            'position': position,
            'size': size,
            'title': title,
            'desc': subtitle,
            'is_active': active,
            'content_object': '71-' + longread
        }

        let url = this.base + 'staff/featurer/featureitem/add';

        this.sendToApi(url, formData, cb);
    }
}

module.exports = KnbApi;
