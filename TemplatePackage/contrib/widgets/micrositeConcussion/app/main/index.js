var Controller	= require('./controller');

module.exports = function ( module ) {

	module
		.controller('MainController', ['$location', '$scope', Controller]);
};