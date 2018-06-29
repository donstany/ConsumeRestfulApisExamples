'use strict';

var config = {};

/**
 * Login
 * @type {String}
 */
config.email = 'stanislav.stanev@tradologic.com';

/**
 * Password
 * @type {String}
 */
config.password = '123456Ss';

/**
 * Auth URL
 * @type {String}
 */
config.oauth = 'https://api.b2bx.exchange/api/v1/b2trade/auth';

/**
 * Websocket service URL
 * @type {String}
 */
config.websocket = 'wss://wss.b2bx.exchange/WSGateway/';

module.exports = config;
