'use strict';

// server settings
var SERVER = {
    API_ROOT: 'https://tools.cdc.gov',
	ROOT_URL: '/api/v2/resources',
	WEB_ROOT: '/',
	SECURE_PROXY_URI: 'secureProxy.asmx/request'
};
module.exports.SERVER = SERVER;

var ANGULARJS = {
	// https://docs.angularjs.org/guide/production
	// Enable/Disable Debug Data
	DEBUG_ENABLED: true
};
module.exports.ANGULARJS = ANGULARJS;

// debug settings
var DEBUG = {

	// settings for debug.log functionality
	// possible values:
	//	true	turns logging on (suggested for development)
	//	false	turns logging off (suggested for production)
    LOGGING: true
};
module.exports.DEBUG = DEBUG;