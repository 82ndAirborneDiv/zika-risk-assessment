var service = require('./service');

module.exports = function ( module ) {

	module
		.factory( 'dataService', [ '$http', service ] );
};