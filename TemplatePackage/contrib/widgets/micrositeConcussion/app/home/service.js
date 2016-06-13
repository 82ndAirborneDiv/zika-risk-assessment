
module.exports = function ( dataService ) {

	return {
		getCollection: function (id) {
			return dataService.getCollection(id);
		},

		getLegacyFeed: function (id) {
			return dataService.getLegacyFeed(id);
		},

	};
};