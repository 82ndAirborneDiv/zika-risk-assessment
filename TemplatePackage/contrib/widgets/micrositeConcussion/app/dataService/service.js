// TEMP (change CONFIG location!)
var _SERVER = require( '../../js/CONFIG' ).SERVER;

module.exports = function ( $http ) {


	function _getJsonP( path, params ) {

		var url = _SERVER.API_ROOT + _SERVER.ROOT_URL + path;

		// apply api key (undefined parameters will be omitted)
		params.apikey = _SERVER.API_KEY;

		// angular expects a name for the jsonp callback function
		params.callback = 'JSON_CALLBACK';

		return $http.jsonp(url, {params: params}).then((function(result) {
			return ({
				data: result.data.results,
				meta: result.data.meta
			});
		}));
	}

	function _post( httpMethod, path, data ) {

		var url = _SERVER.API_ROOT + _SERVER.ROOT_URL + path,
			payload = { url, data: JSON.stringify( data ), httpMethod };

		return $http.post(_SERVER.SECURE_PROXY_URI, JSON.stringify(payload)).then((function(result) {			
			var obj = JSON.parse(result.data.d);
			return ({
				data: obj.results,
				meta: obj.meta
			});
		}));
	}

	return {

		getCollection : function(id){
			var path = '/media/' + id,
				params = {showchildlevel : 1};

			return _getJsonP(path, params);
		},

		getMediaItem : function(id){
			var path = '/media/' + id + '/syndicate';
			return _getJsonP(path, {});
		},

		getLegacyFeed : function(id){
			var url = 'http://www2c.cdc.gov/podcasts/feed.asp?feedid=' + id,
				params = {};

			// angular expects a name for the jsonp callback function
			params.callback = 'JSON_CALLBACK';

			return $http.jsonp(url, {params: params}).then((function(result) {
				var obj = result.data.statuses;
				return (obj);
			}));

		},

		// New 3.0 call
		//getLegacyFeed : function(id){
		//	var url = 'http://oadc-dmb-dev-service.cdc.gov/api/v2/resources/media/' + id + '.rss',
		//		params = {};

		//	// angular expects a name for the jsonp callback function
		//	params.callback = 'JSON_CALLBACK';

		//	return $http.jsonp(url, {params: params}).then((function(result) {
		//		var obj = result.data.statuses;
		//		return (obj);
		//	}));

		//},

	};
};