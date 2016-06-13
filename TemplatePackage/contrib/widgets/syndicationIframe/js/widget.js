(function(window, document, undefined) {

	/*
		TemplatePackage Widget Common Functionality - 03/2015 - G. Ewing

		** Description / Purpose ***********************************************************************************************

		This file is intended to be called locally by any CDC widget, it will load common widget functionality for
		all widgets.

		The intent is common scripts can be shared in to:
		1. Re Use Core Code / Increase Managability / Decrease Maintenance Time / Redundancy
		2. Reduce completity of individual widget libraries
		3. Reduce Complexity / DeMystify Metrics Calling

		***************************************************************************************************************************
	*/

	window.CDC = window.CDC || {};
	window.CDC.Widget = window.CDC.Widget || {};
	window.CDC.Widget.load = function () {

		// ADD POINTER/SHORTCUT FOR COMMON
		window.cdcCommon = window.CDC.Widget.Common;

		// ADD POINTER/SHORTCUT FOR METRICS
		window.cdcMetrics = window.cdcCommon.metrics;

		cdcCommon.log('*********** Hello World! ***********');
		cdcCommon.log('Common Framework Loaded!');
		cdcCommon.log('Widget Load Method Executing Loaded!');

		/*
		OMNITURE PARAMETER KEY / TRANSLATION GUIDE:
		HINT: In Omniture Dashboard 't' is the Equivelant of a paramter with the 'c' prefix; so t32 (Omniture Repoting) is equal to c32 (Parameter Passing)
		HINT: In Omniture Dashboard 'eVar' is the Equivelant of a paramter with the 'v' prefix; so eVar6 (Omniture Repoting) is equal to v6 (Parameter Passing)

		*** 'c' & 'v' Paramter Transations ***

		c8			= Product Type (Widget / Page / Etc. )
		c17			= Syndication Source (Calling Page)
		c22			= ??
		c27			= Delivery Framework: (Default: 'Widget Framework')
		c32			= Widget Id
		c33			= Product Interaction Type
		c47		 	= Feed Name

		*** Named Parameter Translations ***

		pageName	= Widget Name
		channel 		= ??
		useMetrics		= STRING: 'true'/'false' (Should Metrics Be Enabled)

		*/
		cdcCommon.log('Initializing Common Framework Metrics...');

		// SET YOUR EMBED CODE HERE (INT PRE FORMAT [&gt;] instead of [>] etc.)
		cdcCommon.events.setEmbedCode('&lt;div data-cdc-widget="sampleIframe"&gt;&lt;/div&gt;\n&lt;script src="http://prototype.cdc.gov/TemplatePackage/contrib/widgets/tp-widget-external-loader.js"&gt;&lt;/script&gt;');

		// INIT METRICS
		cdcMetrics.init({
			c32 : "TEST_SAMPLE_IFRAME"
			//pageName : "WIDGET_NAME_HERE",
			//useMetrics : 'false'
		});
		cdcCommon.log('Common Framework Metrics Initialized!');

		// Start Syndication script
		getSyndicationContent(window);

		/*
			BASIC USAGE EXAMPLES :

			// SCRIPT CALL WITH CUSTOM PARAM OVERRIDES
			cdcMetrics.trackData({
				c17 : "Your Syndication Override",
				c33 : "Your-Custom-Event"
			});

			// SCRIPT CALL WITH BASIC CUSTOM EVENT TRACKING
			cdcMetrics.trackEvent("Your-Custom-Event");

			// HTML INLINE SCRIPT CALL (NOT SUGGESTED AS BEST PRACTICE - EVENT BINDING PREFERRED)
			<a href="#" onclick="cdcMetrics.trackEvent('Your-Custom-Event')">Your Link</a>
		*/

	};

} (window, document));