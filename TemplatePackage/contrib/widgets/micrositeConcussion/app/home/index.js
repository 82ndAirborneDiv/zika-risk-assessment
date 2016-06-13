var Controller	= require('./controller');
var service 	= require('./service');

module.exports = function ( module ) {

	module
		.factory( 'homeService', [ 'dataService', service ] )
		.controller('homeController', ['homeService', '$location', Controller]);
};