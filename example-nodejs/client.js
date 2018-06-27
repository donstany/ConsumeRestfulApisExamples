const WebSocket = require('ws');
const request = require('request');

try {
    var config = require('./config');
} catch( e ) {
    console.log('Config file is missing. You can create it from template file config.dist.js');
    return;
}

request.post({
    'url': config.oauth,
    'form': {
        'email': config.email,
        'password': config.password
    }
}, (error, response, body) => {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);

    let res = JSON.parse(body);
    let data = res.data;

    if (data.user_id && data.session_token && data.token) {
        /**
         * User ID
         * @type {integer}
         */
        let userId = data.user_id;

        /**
         * Session token
         * @type {string}
         */
        let sessionToken = data.session_token;

        /**
         * Websocket auth token
         * @type {string}
         */
        let authToken = data.token;

        let wss = new WebSocket(config.websocket + '?session_token=' + sessionToken, {
            rejectUnauthorized: false, // Just for test. Allows connection to self-signed SSL.
            headers: {
                'user-agent': '',
            }
        });

        wss.on('error', (e) => {
            console.log('Socket error');
            console.log(e);
        });

        wss.on('message', (data, flags) => {
            console.log('Incoming message:');
            console.log(JSON.parse(data));
        });

        wss.on('open', (e) => {

            // Websocket service authentication
            wss.send(JSON.stringify({
                "m": 0,
                "i": 0,
                "n": 'WebAuthenticateUser',
                "o": '{"SessionToken":"' +  authToken + '"}'
            }));

            // Requesting user info
            wss.send(JSON.stringify({
                "m": 0,
                "i": 0,
                "n": 'GetUserInfo',
                "o": '{"OMSId":1, "UserId":' +  userId + '}'
            }));

            // Requesting instruments list
            wss.send(JSON.stringify({
                "m": 0,
                "i": 0,
                "n": 'GetInstruments',
                "o": '{"OMSId":1}'
            }));

        });

    } else {
        console.log('Connection error');
    }

});
