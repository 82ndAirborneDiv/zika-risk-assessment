(function(window, document, undefined) {

	window.CDC = window.CDC || {};
	window.CDC.Widget = window.CDC.Widget || {};
	window.CDC.Widget.load = function () {

		// ADD POINTER/SHORTCUT FOR COMMON
		window.cdcCommon = window.CDC.Widget.Common;

		// ADD POINTER/SHORTCUT FOR METRICS
		window.cdcMetrics = window.cdcCommon.metrics;

		var callParams = window.cdcCommon.runtime.callParams;

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
		//cdcCommon.log('Initializing Common Framework Metrics...');

		// SET YOUR EMBED CODE HERE (INT PRE FORMAT [&gt;] instead of [>] etc.)
		cdcCommon.events.setEmbedCode('&lt;div data-cdc-widget="sampleIframe"&gt;&lt;/div&gt;\n&lt;script src="https://tools.cdc.gov/1M1B"&gt;&lt;/script&gt;');

		// INIT METRICS
		cdcMetrics.init({
			useMetrics : 'true'
		});
		cdcCommon.log('Common Framework Metrics Initialized!');


		cdcMetrics.trackData({

			c1 : '',
			c2 : document.title.replace('\t', '').replace('\r', '').replace('\n', ''),
			c3 : window.location.hostname,
			c8 : 'Microsite',
			c16 : window.location.href,
			c61 : 'HEADS UP to Youth Sports',
			pageName : 'Home',
			channel : 'Microsite'

		});

		/*
			// SCRIPT CALL WITH BASIC CUSTOM EVENT TRACKING
			cdcMetrics.trackEvent("Your-Custom-Event");
		*/

	};

} (window, document));