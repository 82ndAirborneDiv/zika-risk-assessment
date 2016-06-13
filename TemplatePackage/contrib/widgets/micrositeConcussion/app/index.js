
// services
var dataService = require('./dataService/index');

var home = require('./home/index');
var main = require('./main/index');
var detail = require('./detail/index');


var CONFIG = require('../js/CONFIG'),
	angular = require('angular'),
	microsite = angular.module('microsite', ['ngMessages', 'ngRoute', 'ngSanitize', 'angular-carousel']);

require('angular-messages');
require('angular-route');
require('angular-sanitize');
//require('angular');
require('angular-touch');
require('angular-carousel');

dataService(microsite);

home(microsite);
main(microsite);
detail(microsite);

microsite.config(['$routeProvider', '$locationProvider', '$compileProvider', '$httpProvider',

	function ($routeProvider, $locationProvider, $compileProvider, $httpProvider) {

		// enable (true) disable (false) debug data for development/production
		$compileProvider.debugInfoEnabled(CONFIG.ANGULARJS.DEBUG_ENABLED);

		$routeProvider
			.when('/detail/:id', {
				controller: 'detailController',
				controllerAs: 'detail',
				templateUrl: 'app/detail/template.html'
			})
			.otherwise({
				redirectTo: '/',
				controller: 'homeController',
				controllerAs: 'home',
				templateUrl: 'app/home/template.html'
			});
	}
]);


microsite.filter('trustedSource', ['$sce', function ($sce) {
	return function (src) {
		$sce.trustAsResourceUrl(src);
	};
}]);

microsite.filter('unsafe', ['$sce', function ($sce) {
	return $sce.trustAsHtml;
}]);

microsite.filter('debug', function () {
	return function (input) {
		if (input === '') return 'empty string';
		return input ? input : ('' + input);
	};
});

microsite.filter('dateFormat', function () {
	return function (str) {
		str = str.split(" ");
		var formatted = str[0] + ' ' + str[1] + ' ' + str[2] + ', ' + str[5];
		return formatted;
	};
});

microsite.filter('youTubeCode', function () {
	return function (str) {
		str = str.split('embed/');

		var formatted = str[1];
		return formatted;
	};
});

microsite.directive('myYoutube', ['$sce', function ($sce) {
	return {
		restrict: 'EA',
		scope: { code: '=' },
		replace: true,
		template: '<div class="mediaViewerVidContainer"><iframe class="mediaViewerVid" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
		link: function (scope) {
			scope.$watch('code', function (newVal) {
				if (newVal) {
					scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal + '?modestbranding=1&autohide=1&showinfo=0');
				}
			});
		}
	};
}]);

//microsite.directive('a', function () {
//	return {
//		restrict: 'E',
//		link: function (scope, elem, attrs) {
//			// your code here
			
//			// if element hostname contains 'cdc.gov' add a class

//			var str = attrs.href;
//			//debugger;

//			//var patt = new RegExp(elem[0].host);
//			var patt = new RegExp('#/detail/');

//			if (patt.test(str)) {

//			} else {
//				console.log('external link');
//				$(attrs.$$element).addClass('cdc-microsite-external');
//			}
//		}
//	}
//})


microsite.directive('a', function () {
	return {
		restrict: 'E',
		link: function (scope, elem, attrs) {
			$("a[href^='http://www.cdc.gov']").addClass('cdc-microsite-external');
		}
	}
})