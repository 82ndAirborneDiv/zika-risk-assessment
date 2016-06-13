var Controller	= require('./controller');
var service	= require('./service');

module.exports = function ( module ) {

	module
		.factory('detailService', ['dataService', service])
		.controller('detailController', ['detailService', '$location', '$routeParams', Controller]);
};