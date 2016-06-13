"use strict";

var getSyndicationContent = function (window) {
    //define parameter object
    var options = {
        mediatype: "",
        mediaid: "",
        apiroot: "",
        cssclasses: "syndicate",
        ids: "",
        xpath: "",
        stripscripts: true,
        stripanchors: false,
        stripimages: false,
        stripcomments: true,
        stripstyles: true,
        iframeembed: true,
        imagefloat: "none",
        oe: "UTF-8",
        of: "XHTML",
        ns: "",
        nw: true,
        w: "",
        h: "",
        postprocess: ""
    };

    // load jquery
    loadScript("https://tools.cdc.gov/api/embed/html/js/jquery-1.9.1.min.js", "", function () {
        // check if the jQuery object exist
        if (typeof jQuery === "function") {
            var $ = jQuery.noConflict();
            main($);
        }

    });

    function handlePostProcess() {
        if (options.postprocess != '') {
            eval(options.postprocess);
        }
    }

    // main function
    function main($) {

    	var callParams = window.cdcCommon.runtime.callParams;

    	SetOptions(callParams);
   
    	BuildUrl($, callParams);
    }

    function SetOptions(params) {
    	
    	if (params.mediatype && params.mediatype !== "") {
    		options.mediatype = params.mediatype;
        }

        if (params.mediaid && params.mediaid !== "") {
            options.mediaid = params.mediaid;
        }

        if (params.apiroot && params.apiroot !== "") {
            options.apiroot = params.apiroot;
        }

        if (params.cssclasses && params.cssclasses !== "") {
            options.cssclasses = params.cssclasses;
        }

        if (params.ids && params.ids !== "") {
            options.ids = params.ids;
        }

        if (params.xpath && params.xpath !== "") {
            options.xpath = params.xpath;
        }

        if (params.stripscripts && params.stripscripts !== "") {
            options.stripscripts = params.stripscripts;
        }

        if (params.stripanchors && params.stripanchors !== "") {
            options.stripanchors = params.stripanchors;
        }

        if (params.stripimages && params.stripimages !== "") {
            options.stripimages = params.stripimages;
        }

        if (params.stripcomments && params.stripcomments !== "") {
            options.stripcomments = params.stripcomments;
        }

        if (params.stripstyles && params.stripstyles !== "") {
            options.stripstyles = params.stripstyles;
        }

        if (params.imagefloat && params.imagefloat !== "") {
            options.imagefloat = params.imagefloat;
        }

        if (params.oe && params.oe !== "") {
            options.oe = params.oe;
        }

        if (params.of && params.of !== "") {
            options.of = params.of;
        }

        if (params.ns && params.ns !== "") {
            options.ns = params.ns;
        }

        if (params.nw && params.nw !== "") {
            options.nw = params.nw;
        }

        if (params.w && params.w !== "") {
            options.w = params.w;
        }

        if (params.h && params.h !== "") {
            options.h = params.h;
        }

        if (params.font && params.font !== "") {
        	options.font = params.font;
        }

        if (params.postprocess && params.postprocess !== "") {
            options.postprocess = params.postprocess;
        }

    }

    //function definition
    function loadScript(url, id, callback) {
        var script = document.createElement("script")
        script.type = "text/javascript";

        if (id.length) { script.id = id; }
        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function () {
                callback();
            };
        }
        script.src = url;
        window.document.getElementsByTagName("head")[0].appendChild(script);
    }

    //function definition
    function loadStyle(url, callback) {
        var style = document.createElement("link")

        if (style.readyState) { //IE
            style.onreadystatechange = function () {
                if (style.readyState == "loaded" || style.readyState == "complete") {
                    style.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            style.onload = function () {
                callback();
            };
        }
        style.rel = "stylesheet";
        style.href = url;
        window.document.getElementsByTagName("head")[0].appendChild(style);
    }

    //function definition
    function BuildUrl($, $obj) {
        if (options.mediaid == "") { alert("No Media Id was specified."); return; }

        var url = options.apiroot + "/v2/resources/media/" + options.mediaid + "/syndicate?";

        //set values for anything not set as default -
        if (options.cssclasses != "syndicate")
        { url += "&cssclasses=" + options.cssclasses; }
        if (options.ids != "")
        { url += "&ids=" + options.ids; }
        if (options.xpath != "")
        { url += "&xpath=" + options.xpath; }
        if (options.stripscripts != true)
        { url += "&stripscripts=" + options.stripscripts; }
        if (options.stripanchors != false)
        { url += "&stripanchors=" + options.stripanchors; }
        if (options.stripimages != false)
        { url += "&stripimages=" + options.stripimages; }
        if (options.stripcomments != true)
        { url += "&stripcomments=" + options.stripcomments; }
        if (options.stripstyles != true)
        { url += "&stripstyles=" + options.stripstyles; }
        if (options.imagefloat != "none")
        { url += "&imagefloat=" + options.imagefloat; }
        if (options.oe != "UTF-8")
        { url += "&oe=" + options.oe; }
        if (options.of != "XHTML")
        { url += "&of=" + options.of; }
        if (options.ns != "cdc")
        { url += "&ns=" + options.ns; }
        if (options.nw != true)
        { url += "&nw=" + options.nw; }
        if (options.w != "")
        { url += "&w=" + options.w; }
        if (options.h != "")
        { url += "&h=" + options.h; }

        url += "&callback=?";
        
        //add class
        $($obj).addClass(options.cssclasses)

        // Load with CS injection
        MakeAsyncRequest(url, $, $obj, options.mediaid);
    }

    function MakeAsyncRequest(url, $, $obj, mediaid) {
        $.ajax({
            url: url,
            dataType: 'jsonp'
        })
        .done(function (response) {

        	$('.widget-content').html(response.results.content);

        	// Add font override
        	var myFont = options.font;
        	if (myFont) {
        		$('head').append('<style>body, h1, h2, h3, h4, h5, h6, p, li, button, input, select, textarea {font-family:' + myFont + ' !important;}</style>');
        	}

            // Accordion support            
            if ($('.accordion').length > 0) {
                var $accordion = $('.accordion');

                // Load JqueryUI styles
                $('<link rel="stylesheet" type="text/css" href="/TemplatePackage/3.0/css/lib/jquery-ui/jquery-ui.css">').appendTo("head");

                // Load JqueryUI
                loadScript("https://tools.cdc.gov/TemplatePackage/3.0/js/libs/jquery-ui.js", "", function () {
                    $accordion.accordion();
                });
            };

            handlePostProcess();
        })
        .fail(function (xhr, ajaxOptions, thrownError) { /*alert(xhr.status); alert(thrownError);*/ })
    }

};