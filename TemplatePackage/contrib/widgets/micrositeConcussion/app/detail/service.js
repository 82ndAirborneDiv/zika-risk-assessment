

module.exports = function ( dataService ) {

	return {
		getMediaItem: function ( id ) {
			return dataService.getMediaItem( id ).then( ({ data }) => ({ data:  data }) );
		}
	};
};