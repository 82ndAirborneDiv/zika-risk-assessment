window.console = window.console || {};
window.console.log = window.console.log || function() {
    return false;
};

// DEFINE APP & DEPENDENCIES
var appNewsAndPhotos = angular.module('appNewsAndPhotos', [
    'ngRoute',
    'appNewsAndPhotosControllers',
    'ngSanitize',
    'ngAria'
]);

// DEFINE ROUTES
appNewsAndPhotos.config(['$routeProvider', function($routeProvider) {

    // MAIN / HOME PAGE
    $routeProvider.when('/main/', {
        templateUrl: '/TemplatePackage/contrib/widgets/newsAndPhotos/html/main.html',
        controller: 'mainCtrl'
    });

    // EMBED PAGE
    $routeProvider.when('/embed/', {
        templateUrl: '/TemplatePackage/contrib/widgets/newsAndPhotos/html/embed.html',
        controller: 'embedCtrl'
    });

    // INFO PAGE
    $routeProvider.when('/info/', {
        templateUrl: '/TemplatePackage/contrib/widgets/newsAndPhotos/html/info.html',
        controller: 'infoCtrl'
    });

    // DISCLAIMER PAGE
    $routeProvider.when('/disclaimer/', {
        templateUrl: '/TemplatePackage/contrib/widgets/newsAndPhotos/html/disclaimer.html',
        controller: 'disclaimerCtrl'
    });

    // LOADER PAGE
    $routeProvider.when('/load/', {
        templateUrl: '/TemplatePackage/contrib/widgets/newsAndPhotos/html/load.html',
        controller: 'loadCtrl'
    });

    // DEFAULT ROUTE
    $routeProvider.otherwise({
        redirectTo: '/load/'
    });

}]);

appNewsAndPhotos.run(function($rootScope, $http, $location, $timeout, $filter, $window, $templateCache) {

    var rs = $rootScope;

    rs.cdcCommon = $window.cdcCommon;
    rs.cdcMetrics = rs.cdcCommon.metrics;

    rs.x2js = new X2JS();

    rs.parseXml = function(data) {
        return rs.x2js.xml_str2json(data);
    };

    rs.resizeIframe = function(intMsDelay) {

        intMsDelay = intMsDelay || 250;

        if (rs.resizeTimeout) {
            $timeout.cancel(rs.resizeTimeout);
        }

        rs.resizeTimeout = $timeout(function(){
            if ($window.hasOwnProperty('parentIFrame') && $window.parentIFrame.hasOwnProperty('size')) {
                $window.parentIFrame.size();
            }
        }, intMsDelay, false);

    };

    rs.feedProcessor = (function() {

        // CACHE PROCESSORS
        var objProcessors = {
            rss : function (feedUrl) {

                return $http.get(feedUrl).then(function (apiCall) {

                    // LOAD PHOTO LIST DATA
                    var rssJsonData = rs.parseXml(apiCall.data), objReturn = {};

                    // RETURN DEFAULTS
                    objReturn.title = "Unspecified Feed Name";
                    objReturn.description = "";
                    objReturn.data = [];

                    console.log(rssJsonData);

                    if (rssJsonData.hasOwnProperty('rss')) {

                        // STANDARD DEFAULT HANDLER
                        objReturn.title = rssJsonData.rss.channel.title;
                        objReturn.description = rssJsonData.rss.channel.description;
                        objReturn.data = rssJsonData.rss.channel.item;

                    } else {

                        // ALTERNATIVE CDC CONTENT SERVICES API HANDLER
                        if (rssJsonData.hasOwnProperty('response')) {

                            var aryTemp, objCurrItem, objReturn;

                            aryTemp = rssJsonData.response.results.mediaItem2;

                            for (var i = aryTemp.length - 1; i >= 0; i--) {
                                objCurrItem = aryTemp[i];
                                objReturn.data.push({
                                    title : objCurrItem.name || '',
                                    label : objCurrItem.name || '',
                                    description : objCurrItem.description,
                                    link : objCurrItem.contentUrl,
                                    pubDate : objCurrItem.datePublished,
                                    enclosure : {
                                        _url : objCurrItem.sourceUrl || null
                                    }
                                });
                            };
                        }
                    }

                    // FIX DATES
                    if (objReturn.data.length) {
                        for (var i = objReturn.data.length - 1; i >= 0; i--) {
                            objReturn.data[i].pubDate = Date.parse(objReturn.data[i].pubDate);
                        }
                    }

                    return objReturn;

                }, rs.feedError);
            },
            jsonp : function (feedUrl) {

                var strConcat = ((feedUrl.indexOf('?') > -1) ? '&' : '?');

                // ADD CALLBACK
                feedUrl = feedUrl + strConcat + "callback=JSON_CALLBACK&amp;prefix=JSON_CALLBACK"

                return $http.jsonp(feedUrl).then(function (apiJsonData) {

                    var aryTemp, objCurrItem, objReturn = {};

                    // CAPTURE RETURN DATA
                    objReturn.title = apiJsonData.data.title;
                    objReturn.description = apiJsonData.data.description;
                    objReturn.data = apiJsonData.data.entries || [];

                    console.log(objReturn);

                    // FIX DATES
                    if (objReturn.data.length) {
                        for (var i = objReturn.data.length - 1; i >= 0; i--) {
                            objReturn.data[i].pubDate = Date.parse(objReturn.data[i].pubdate);
                            objReturn.data[i].enclosure = {
                                _url: objReturn.data[i].enclosureurl
                            };
                        }
                    }

                    return objReturn;
                }, rs.feedError);

            }
        };

        // RETURN METHOD
        return function (feedUrl, feedType) {

            var strFeedUrl = decodeURIComponent(feedUrl);

            // DE WE HAVE A PRCESSOR FOR THE FEED TYPE PASSED?
            if (objProcessors.hasOwnProperty(feedType)) {

                // RETURN PROMISE WITH PROCESSED DATA
                return objProcessors[feedType].call(this, strFeedUrl);

            } else {

                // RETURN EMPTY/FAUX PROMISE WITH EMPTY DATA
                return $timeout(function() {
                    return [];
                }, 0);

            }
        };

    } ());

    rs.feedError = function (data) {
        return [];
    };

    rs.widgetInit = function(fctCallback) {

        // GET OR DEFAULT CALLBACK
        fctCallback = fctCallback || function() {
            return true;
        };

        if (!rs.widgetInitialized) {

            // INIT AND CALLBACK

            // ADMIN FLAGS (DEVELOPMENT & DEBUG PURPOSES ONLY)
            rs.admin = {
                display: {
                    debug: true
                },
                logging: {
                    level: 0
                }
            };

            // INIT / DEFAULT LMS CONFIG
            rs.widgetConfig = {
                courseHistoryEnabled: false,
                newsFeed : null,
                newsFeedType : 'rss',
                photosFeed : null,
                photosFeedType : 'rss',
                defaultView : null,
                widgetTitle : null,
                tabsEnabled : false
            };

            // START: GET PARAMETERS

            // ALLOW FOR A HISTORY USAGE PARAMTER TO BE PASSED AS AN EMBED PARAM
            // THIS AFFECTS BACK BUTTON BEHAVIOR IN WIDGETS (TRUE MEANS IT WILL USE HISTORY - NOT DESIRED IN MOST CASES)
            if (window.cdcCommon.runtime.callParams.useHistory) {
                rs.widgetConfig.courseHistoryEnabled = window.cdcCommon.runtime.callParams.useHistory;
            }

            // OVERRIDE CONTENT NEWS FEED FROM PASSED PARAMS IF POSSIBLE
            if (window.cdcCommon.runtime.callParams.newsFeed) {
                rs.widgetConfig.newsFeed = window.cdcCommon.runtime.callParams.newsFeed;
            }

            // OVERRIDE CONTENT NEWS FEED TYPE FROM PASSED PARAMS IF POSSIBLE
            if (window.cdcCommon.runtime.callParams.newsFeedType && window.cdcCommon.runtime.callParams.newsFeedType === "jsonp") {
                rs.widgetConfig.newsFeedType = window.cdcCommon.runtime.callParams.newsFeedType;
            }

            // OVERRIDE CONTENT PHOTOS PATH FROM PASSED PARAMS IF POSSIBLE
            if (window.cdcCommon.runtime.callParams.photosFeed) {
                rs.widgetConfig.photosFeed = window.cdcCommon.runtime.callParams.photosFeed;
            }

            // OVERRIDE CONTENT PHOTOS FEED TYPE FROM PASSED PARAMS IF POSSIBLE
            if (window.cdcCommon.runtime.callParams.photosFeedType  && window.cdcCommon.runtime.callParams.photosFeedType === "jsonp") {
                rs.widgetConfig.photosFeedType = window.cdcCommon.runtime.callParams.photosFeedType;
            }

            // OVERRIDE CONTENT NEWS FEED FROM PASSED PARAMS IF POSSIBLE
            if (window.cdcCommon.runtime.callParams.defaultView) {
                rs.widgetConfig.defaultView = window.cdcCommon.runtime.callParams.defaultView;
            }

             // OVERRIDE METRICS LOGGING LEVEL (1 Min to 3 Max)
            if (window.cdcCommon.runtime.callParams.newsFeed) {
                rs.widgetConfig.metricsLevel = window.cdcCommon.runtime.callParams.mLevel || 3;
            }

            // END: GET PARAMETERS

            // HAVE PHOTOS BEEN REQUESTED
            if (rs.widgetConfig.photosFeed) {

                var blnContinue = (rs.widgetConfig.photosFeed.match(/\/[A-Z]/gi) || rs.widgetConfig.photosFeed.indexOf('.cdc.gov') > -1);

                if (blnContinue) {

                    // TRACK FEED LOAD
                    if (rs.widgetConfig.metricsLevel >= 2) {
                        rs.cdcMetrics.trackEvent("photos-feed-url", rs.widgetConfig.photosFeed);
                    }

                    // DECODE FEED
                    rs.widgetConfig.photosFeed = decodeURIComponent(rs.widgetConfig.photosFeed);

                    // DO WE NEED TO GET PHOTOS?
                    if (!rs.photosPromise) {

                        // GET DATA PROMISE FROM PROCESSOR
                        rs.photosPromise = rs.feedProcessor(rs.widgetConfig.photosFeed, rs.widgetConfig.photosFeedType);

                        // SET DATA RETURN FROM PROCESSOR ON RETURN
                        rs.photosPromise.then(function(objApiData){
                            rs.photosTitle = objApiData.title;
                            rs.photosDescription = objApiData.description;
                            rs.photosList = objApiData.data;

                            // TRACK FEED TITLE
                            if (rs.widgetConfig.metricsLevel >= 2) {
                                rs.cdcMetrics.trackEvent("photos-feed-title", rs.photosTitle);
                            }
                        });
                    }

                    // IS DEFAULT VIEW MISSING?
                    if (!rs.widgetConfig.defaultView) {

                        // SET PHOTOS AS DEFAULT VIEW
                        rs.widgetConfig.defaultView = "photos";
                    }
                }
            }

            // HAS NEWS BEEN REQUESTED
            if (rs.widgetConfig.newsFeed) {

                var blnContinue = (rs.widgetConfig.newsFeed.match(/\/[A-Z]/gi) || rs.widgetConfig.newsFeed.indexOf('.cdc.gov') > -1);

                if (blnContinue) {

                    // TRACK FEED LOAD
                    if (rs.widgetConfig.metricsLevel >= 2) {
                        rs.cdcMetrics.trackEvent("news-feed-url", rs.widgetConfig.newsFeed);
                    }

                    // DECODE FEED
                    rs.widgetConfig.newsFeed = decodeURIComponent(rs.widgetConfig.newsFeed);

                    // DO WE NEED TO GET NEWS?
                    if (!rs.newsPromise) {

                        // GET DATA PROMISE FROM PROCESSOR
                        rs.newsPromise = rs.feedProcessor(rs.widgetConfig.newsFeed, rs.widgetConfig.newsFeedType);

                        // SET DATA RETURN FROM PROCESSOR ON RETURN
                        rs.newsPromise.then(function(objApiData){
                            rs.newsTitle = objApiData.title;
                            rs.newsDescription = objApiData.description;
                            rs.newsList = objApiData.data;

                            // TRACK FEED TITLE
                            if (rs.widgetConfig.metricsLevel >= 2) {
                                rs.cdcMetrics.trackEvent("news-feed-title", rs.newsTitle);
                            }
                        });

                    }

                    // IS DEFAULT VIEW MISSING?
                    if (!rs.widgetConfig.defaultView) {

                        // SET NEWS AS DEFAULT VIEW
                        rs.widgetConfig.defaultView = "news";
                    }

                }

            }

            // NO NEWS REQUESTED - SET EMPTY PROMISE
            if (!rs.newsPromise) {
                rs.newsPromise = $timeout(function () {
                    return null;
                }, 0);
            }

            // NO PHOTOS REQUESTED - SET EMPTY PROMISE
            if (!rs.photosPromise) {
                rs.photosPromise = $timeout(function () {
                    return null;
                }, 0);
            }

            // DETERMINE TITLE
            if (rs.widgetConfig.newsFeed && rs.widgetConfig.photosFeed) {
                rs.widgetConfig.tabsEnabled = true;
                rs.widgetConfig.widgetTitle = "News and Photos";
                rs.widgetConfig.widgetMode = "news-and-photos";
            } else if (rs.widgetConfig.photosFeed) {
                rs.widgetConfig.widgetTitle = "Photos";
                rs.widgetConfig.widgetMode = "photos-only";
            } else {
                rs.widgetConfig.widgetTitle = "News";
                rs.widgetConfig.widgetMode = "news-only";
            }

            // TRACK FEED LOAD
            rs.cdcMetrics.trackEvent("widget-mode-selection", rs.widgetConfig.widgetMode);

            rs.widgetInitialized = true;
        }

        // EXECUTE PROMISE CHAIN (NEWS IF AVAILABLE)
        rs.newsPromise.then(function(apiData) {

            // EXECUTE PROMISE CHAIN (PHOTOS IF AVAILABLE)
            rs.photosPromise.then(function(apiData) {

                rs.setView(rs.widgetConfig.defaultView);

                // EXECUTE CALLBACK AFTER PROMISE CHAIN
                fctCallback();

                return apiData;
            });

            return apiData;
        });
    };

    rs.cacheTemplate = (function() {
        var templateId = 0;

        return function(templateHtml) {

            templateId = templateId + 1;

            var templateName = 'ct_' + templateId;

            $templateCache.put(templateName, templateHtml);

            return templateName;
        }
    }());

    rs.randRange = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // BASE RELOCATION HANDLER
    rs.setPath = function(strPath) {

        // RELOCATION LOGIC
        if (rs.widgetConfig.courseHistoryEnabled) {

            // RELOCATE (TRIGGERING HISTORY TRACK)
            $location.path(strPath);

        } else {

            // REPLACE (BYPASSING HSITORY TRACK)
            $location.path(strPath).replace();
        }
    };

    rs.setView = (function () {

        var currentView = null;

        return function (strView) {

            var argView = strView || rs.widgetConfig.defaultView;

            if (currentView !== argView) {

                currentView = argView;
                rs.currentView = argView;

                if (argView === 'news') {
                    rs.subView = "./html/sub-news.html";
                    if (rs.widgetConfig.metricsLevel >= 3) {
                        rs.cdcMetrics.trackEvent("view-selected", "news-view");
                        $rootScope.cdcMetrics.update({
                            contenttitle : "news-view"
                        });
                    }
                } else {
                    rs.subView = "./html/sub-photos.html";
                    if (rs.widgetConfig.metricsLevel >= 3) {
                        rs.cdcMetrics.trackEvent("view-selected", "photos-view");
                        $rootScope.cdcMetrics.update({
                            contenttitle : "photos-view"
                        });
                    }
                }

                // SET CURRENT VIEW ON LOAD IN
                rs.cdcMetrics.update({
                    contenttitle : rs.currentView
                });
            }
        };
    } ());

    // SET GLOBAL / DEFAULT BUTTON CLASS OBJECT(S)
    rs.responseClasses = {
        text: {
            "true": "text-success",
            "false": "text-danger",
            "null": "text-default"
        },
        section: {
            "true": "bg-success",
            "false": "bg-danger",
            "null": "bg-default"
        }
    };
    rs.buttonClasses = {
        "true": "btn-primary",
        "false": "btn-default",
        "null": "btn-default"
    };
     rs.tabButtonClasses = {
        "true": "btn-default",
        "false": "btn-primary",
        "null": "btn-default"
    };
    rs.imgButtonClasses = {
        "true": "btn-primary",
        "false": "btn-default disabled",
        "null": "btn-primary"
    };
    rs.questionTextClasses = {
        "true": "col-md-6 col-sm-6 col-xs-12",
        "false": "col-md-12"
    }
});

appNewsAndPhotos.directive('selectOnClick', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                if (attrs.selectOnClick == 'true') {
                    if (!$window.getSelection().toString()) {
                        // Required for mobile Safari
                        this.setSelectionRange(0, this.value.length)
                    }
                }
            });
        }
    };
}]);

appNewsAndPhotos.directive('resizeOnLoad', function () {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            if (attrs.resizeOnLoad == 'true') {
                element.bind("load" , function(e){
                    scope.resizeIframe(100);
                });
            }
        }
    }
});

// MANUALLY BOOTSTRAP APP
angular.bootstrap(document.getElementById(document.body.id), ['appNewsAndPhotos']);
