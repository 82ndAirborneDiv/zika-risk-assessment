// INIT CONTROLLERS CONTAINER
var appNewsAndPhotosControllers = angular.module('appNewsAndPhotosControllers', []);

// CONTROLLER ROUTE "#/main/"
appNewsAndPhotosControllers.controller('mainCtrl', ['$rootScope', '$scope', '$location', '$filter', '$timeout', function ($rootScope, $scope, $location, $filter, $timeout) {

    // INIT WIDGET
    $rootScope.widgetInit(function () {

        $scope.currentImage = 0;
        $scope.blnCaption = false;

        $scope.nextImage = function () {
            if ($scope.photosList && $scope.photosList.length && $scope.currentImage < ($scope.photosList.length - 1)) {
                $scope.currentImage = $scope.currentImage + 1;
                if ($rootScope.widgetConfig.metricsLevel >= 3) {
                    $rootScope.cdcMetrics.trackEvent("button-press","next-image");
                }
            }
        };

        $scope.prevImage = function () {
            if ($scope.photosList && $scope.photosList.length && $scope.currentImage > 0) {
                $scope.currentImage = $scope.currentImage - 1;
                if ($rootScope.widgetConfig.metricsLevel >= 3) {
                    $rootScope.cdcMetrics.trackEvent("button-press","previous-image");
                }
            }
        };

        $scope.captionToggle = function ($event) {
            $scope.blnCaption = !$scope.blnCaption;
            $scope.setAriaMoreLess();
            return false;
        };

        $scope.captionOff = function ($event) {
            $scope.blnCaption = false;
            $scope.setAriaMoreLess();
            $event.stopPropagation();
            return false;
        };

        $scope.captionOn = function ($event) {
            $scope.blnCaption = true;
            $scope.setAriaMoreLess();
            $event.stopPropagation();
            return false;
        };

        $scope.clickThrough = function (url) {
            if ($rootScope.widgetConfig.metricsLevel >= 3) {
                $rootScope.cdcMetrics.trackEvent("click-through", url);
            }
            return true;
        };

        $scope.setAriaMoreLess = function (blnTrack) {
            $scope.ariaMoreLess = ($scope.blnCaption ? "View less information" : "View more information");
            blnTrack = blnTrack || false;
            if (blnTrack && $rootScope.widgetConfig.metricsLevel >= 3) {
                var strOnOff = ($scope.blnCaption == true) ? "on" : "off";
                $rootScope.cdcMetrics.trackEvent("button-press", 'toggle-captions-' + strOnOff);
            }
        };

        // SET CURRENT VIEW ON LOAD IN
        $rootScope.cdcMetrics.update({
            contenttitle : $rootScope.currentView
        });

        // SET MORE / LESS INFO TOGGLE
        $scope.setAriaMoreLess(false);

        // IF NEEDED - TRIGGER RESIZE
        $timeout(function(){
            //$rootScope.resizeIframe(0);
        }, 150);
    });
}]);

// CONTROLLER ROUTE "#/info/"
appNewsAndPhotosControllers.controller('infoCtrl', ['$rootScope', '$scope', '$location', '$filter', function ($rootScope, $scope, $location, $filter) {
    $rootScope.widgetInit(function () {
        angular.element(document.querySelector('#destination-info')).html(angular.element(document.querySelector('#source-info')).html());
        if ($rootScope.widgetConfig.metricsLevel >= 3) {
            $rootScope.cdcMetrics.trackEvent("view-selected", "info-view");
            $rootScope.cdcMetrics.update({
                contenttitle : "info-view"
            });
        }
        //$rootScope.resizeIframe(0);
    });
}]);

// CONTROLLER ROUTE "#/disclaimer/"
appNewsAndPhotosControllers.controller('disclaimerCtrl', ['$rootScope', '$scope', '$location', '$filter', function ($rootScope, $scope, $location, $filter) {
    $rootScope.widgetInit(function () {
        angular.element(document.querySelector('#destination-disclaimer')).html(angular.element(document.querySelector('#source-disclaimer')).html());
        if ($rootScope.widgetConfig.metricsLevel >= 3) {
            $rootScope.cdcMetrics.trackEvent("view-selected","disclaimer-view");
            $rootScope.cdcMetrics.update({
                contenttitle : "disclaimer-view"
            });
        }
        //$rootScope.resizeIframe(0);
    });
}]);

// CONTROLLER ROUTE "#/embed/"
appNewsAndPhotosControllers.controller('embedCtrl', ['$rootScope', '$scope', '$location', '$filter', function ($rootScope, $scope, $location, $filter) {
    $rootScope.widgetInit(function () {
        if ($rootScope.widgetConfig.metricsLevel >= 3) {
            $rootScope.cdcMetrics.trackEvent("view-selected","embed-code-view");
            $rootScope.cdcMetrics.update({
                contenttitle : "embed-code-view"
            });
        }
        //$rootScope.resizeIframe(0);
    });
}]);

// CONTROLLER ROUTE "#/load/"
appNewsAndPhotosControllers.controller('loadCtrl', ['$rootScope', '$scope', '$location', '$filter', function ($rootScope, $scope, $location, $filter) {
    //$rootScope.resizeIframe(0);
    $rootScope.widgetInit(function () {
        $rootScope.setPath('/main/');
        //$rootScope.resizeIframe(0);
    });
}]);