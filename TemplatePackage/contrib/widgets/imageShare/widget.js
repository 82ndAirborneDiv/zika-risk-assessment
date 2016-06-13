(function(window, document, $, undefined) {

	window.CDC = window.CDC || {};
	window.CDC.Widget = window.CDC.Widget || {};
	window.CDC.Widget.load = function (objCommon) {

		// ON DOM READY
		$(function(){

			var self = this;

			// ADD POINTER/SHORTCUT FOR COMMON
			window.cdcCommon = window.CDC.Widget.Common;

			// ADD POINTER/SHORTCUT FOR METRICS
			window.cdcMetrics = window.cdcCommon.metrics;

			// ADD WIDGET POINTER
			window.widget = window.CDC.Widget;

			// GET / DEFAULT RUNTIME
			var runtime = window.widget.runtime || {};

			// SELECTOR CONFIGURATION
			runtime.selectors = {
				code : '#tp-widget-share-code',
				container : '#image-container',
				pdfLink : '#pdf-link',
				infoLink : '#info-link',
				shareLink : '#share-link',
				iconMenu : '#icon-menu',
				moreMenu : '#more-menu',
				accessibilityLink : '#accessibility-link',
				dynamicImageTarget : '#dynamic-image-target'
			};

			/* TRUSTED HOSTS
			runtime.allowedHosts = [];*/

			// INIT ELEMENT CACHE
			runtime.jqCache = {};

			// LOOP SELECTORS
			for (runtime.currKey in runtime.selectors) {

				// FOR EACH - GET & CACHE ELEMENTS AS THE SELETORS KEY NAME
				runtime.jqCache[runtime.currKey] = $(runtime.selectors[runtime.currKey]);
			};

			// SET EXTERNAL CONFIG PATH (IF AVAILABLE)
			runtime.strConfigPath = objCommon.getCallParam('configPath') || "";

			function initEmbedCode () {

				// BUILD EMBED CODE
				var aryEmbedCode = [];

				// OPEN EMBED DIV
				aryEmbedCode.push('&lt;div data-cdc-widget="imageShare"');
				aryEmbedCode.push('data-image-path="' + runtime.strImagePath + '"');

				// ADD OPTIONAL PARAMETERS IF PASSED
				if (runtime.strImageName) {
					aryEmbedCode.push('data-image-name="' + runtime.strImageName + '"');
				}
				if (runtime.strImageAlt.length) {
					aryEmbedCode.push('data-image-alt="' + runtime.strImageAlt + '"');
				}
				if (runtime.str508Link.length) {
					aryEmbedCode.push('data-access-link="' + runtime.str508Link + '"');
				}
				if (runtime.strPdfLink.length) {
					aryEmbedCode.push('data-pdf-link="' + runtime.strPdfLink + '"');
				}
				if (runtime.strMaxWidth.length) {
					aryEmbedCode.push('data-widget-max-width="' + runtime.strMaxWidth + '"');
				}

				// TERMINATE OPEN OF DIV AND THEN CLOSE DIV
				aryEmbedCode.push('&gt;&lt;/div&gt;');

				// ADD NEW LINE
				aryEmbedCode.push('\n');

				// ADD SCRIPT TAG
				//aryEmbedCode.push('&lt;script src="//' + runtime.strHost + '/TemplatePackage/contrib/widgets/tp-widget-external-loader.js"&gt;&lt;/script&gt;');
				aryEmbedCode.push('&lt;script src="https://tools.cdc.gov/1M1B"&gt;&lt;/script&gt;');

				// UPDATE THE EMBED CODE
				cdcCommon.runtime.embedCode = aryEmbedCode.join(" ");
				cdcCommon.events.setEmbedCode(cdcCommon.runtime.embedCode);
			};

			function initEventHandlers () {

				// SET EVENT HANDLERS
				window.CDC.Widget.events = {
					menuResize : function () {
						var imgWidth = runtime.jqCache.dynamicImageTarget.width();
						setTimeout(function() {
							// SET MENU WIDTH TO CONTAINER WIDTH
							runtime.jqCache.iconMenu.width(imgWidth);
							runtime.jqCache.moreMenu.width(imgWidth);
							//runtime.jqCache.iconMenu.hide();
							//runtime.jqCache.moreMenu.show();

							if (imgWidth >= 200) {
								runtime.jqCache.container.removeClass('vp1').removeClass('vpMicro');
							} else {
								if (imgWidth >= 125) {
									runtime.jqCache.container.addClass('vp1').removeClass('vpMicro');
								} else {
									runtime.jqCache.container.addClass('vpMicro').removeClass('vp1');
								}
							}
							//runtime.blnToggled = true;
							//window.CDC.Widget.events.menuToggle();
						}, 250);
					},
					menuToggle : (function(){

						runtime.blnToggled = true;

						return function (e) {

							if (runtime.blnToggled) {
								runtime.jqCache.iconMenu.show();
								runtime.jqCache.moreMenu.hide();
							} else {
								runtime.jqCache.iconMenu.hide();
								runtime.jqCache.moreMenu.show();
							}

							runtime.blnToggled = !runtime.blnToggled;

							return false;
						};
					}()),
					openWindow : function(){
						window.open($(this).attr('href'));
						return false;
					}
				};

				// SET CLICK HANDLER OF EMBED CODE INPUT
				if (runtime.jqCache.code.length) {
					runtime.jqCache.code.on('click', window.CDC.Widget.events.selectAllText);
				}

				// SET CLICK HANDLER FOR MENU TOGGLE ELEMENTS
				if (runtime.jqCache.dynamicImageTarget.length) {
					runtime.jqCache.dynamicImageTarget.on('click', window.CDC.Widget.events.menuToggle);
					runtime.jqCache.moreMenu.on('click', window.CDC.Widget.events.menuToggle);
					$(window).on('resize', window.CDC.Widget.events.menuResize);
				}

				/* LOCAL STORAGE PARAM SUPPORT
				if (runtime.jqCache.shareLink.length) {
					var href = runtime.jqCache.shareLink.attr('href');
					runtime.jqCache.shareLink.attr('href', href + '?windowId=' + objCommon.getCallParam('windowId'));
				}
				 */

				// IF IT EXISTS, FORMAT SHARE LINK
				if (runtime.jqCache.shareLink.length) {
					// ENSURE HOST IS IN THIS DOMAIN
					var shareHref = runtime.jqCache.shareLink.attr('href');
					if (runtime.jqCache.shareLink[0].hostname.indexOf(runtime.strHost) === -1) {
						runtime.jqCache.shareLink[0].hostname = runtime.strHost;
					}
					// ENSURE THE SHARE LINK HAS THE APPROPRIATE QUERY STRING ATTACHED
					runtime.jqCache.shareLink.attr('href', shareHref + location.search);

					// OPEN WITH WINDOW OPEN INSTEAD OF DEFAULT HANDLER
					// THIS ALLOWS FOR WINDOW.CLOSE() IN THE CHILD WINDOW
					runtime.jqCache.shareLink.on('click', window.CDC.Widget.events.openWindow);
				}
			};

			function initMenuIcons () {

				console.log(objCommon.runtime.callParams);

				// UPDATE IMAGE WITH PASSED PARAM DATA
				if (runtime.jqCache.dynamicImageTarget.length) {

					// ENSURE HOST IS IN THIS DOMAIN
					if (runtime.strImagePath.indexOf(runtime.strHost) === -1) {
						runtime.strImagePath = window.location.protocol + '//' + runtime.strHost + runtime.strImagePath;
					}
					var strUrl = cdcCommon.replaceAll("|",'&',runtime.strImagePath);
					strUrl = cdcCommon.replaceAll('~','=',strUrl);
					runtime.jqCache.dynamicImageTarget.attr('src', strUrl);
					//runtime.jqCache.dynamicImageTarget.attr('src', runtime.strImagePath);
					runtime.jqCache.dynamicImageTarget.attr('alt', runtime.strImageAlt || "Configuration Error");
					runtime.strPageName = "Infographic_" + runtime.strImageName;
				}

				// IF 508 ELEMENT EXISTS AND 508 COMPLIANT PATH IS PASSED, UPDATE LINK AND MAKE VISIBLE TO USERS/SCREEN READERS
				if (runtime.jqCache.accessibilityLink.length && runtime.str508Link.length) {

					// ENSURE HOST IS IN THIS DOMAIN
					if (runtime.str508Link.indexOf(runtime.strHost) === -1) {
						runtime.str508Link = window.location.protocol + '//' + runtime.strHost + runtime.str508Link;
					}
					var strUrl = cdcCommon.replaceAll('|','&',runtime.str508Link);
					strUrl = cdcCommon.replaceAll('~','=',strUrl);
					runtime.jqCache.accessibilityLink.attr('href', strUrl);
					runtime.jqCache.accessibilityLink.css('display','inline-block');
					runtime.intMenuIcons += 1;

					// OPEN WITH WINDOW OPEN INSTEAD OF DEFAULT HANDLER
					// THIS ALLOWS FOR WINDOW.CLOSE() IN THE CHILD WINDOW
					runtime.jqCache.accessibilityLink.on('click', window.CDC.Widget.events.openWindow);
				}

				// IF PDF ELEMENT EXISTS AND PDF PATH IS PASSED, UPDATE LINK AND MAKE VISIBLE TO USERS/SCREEN READERS
				if (runtime.jqCache.pdfLink && runtime.strPdfLink.length) {

					// ENSURE HOST IS IN THIS DOMAIN
					if (runtime.strPdfLink.indexOf(runtime.strHost) === -1) {
						runtime.strPdfLink = window.location.protocol + '//' + runtime.strHost + runtime.strPdfLink;
					}
					var strUrl = cdcCommon.replaceAll('|','&',runtime.strPdfLink);
					strUrl = cdcCommon.replaceAll('~','=',strUrl);
					runtime.jqCache.pdfLink.attr('href', strUrl);
					runtime.jqCache.pdfLink.css('display', 'inline-block');
					runtime.intMenuIcons += 1;
				}

				// HANDLE MENU MORE
				if (runtime.jqCache.moreMenu.length && runtime.strMenuAlign.length) {
					runtime.jqCache.moreMenu.css('text-align', runtime.strMenuAlign);
					runtime.jqCache.iconMenu.css('text-align', runtime.strMenuAlign);
				}
			};

			function initMetrics() {
				// SETUP METRICS
				cdcCommon.log('Initializing Common Framework Metrics...');
				cdcMetrics.init({
					c32 : "widget-113", // WIDGET ID
					contenttitle : runtime.strPageName // PAGE NAME (IMAGE NAME)
				});
				cdcCommon.log('Common Framework Metrics Initialized!');
			};

			function initConfig (fctCallback) {

				// GET TARGET IMAGE ELEMENT AND URL PARAMS FROM PARENT PAGE
				runtime.strHost = objCommon.getCallParam('cHost') || window.location.host;
				runtime.strRequestedHost = objCommon.getCallParam('host');
				runtime.strPageName = "Share Page";
				runtime.intMenuIcons = 2; // 2 ICONS BY DEFAULT (INFO & EMBED)

				// REQUESTED HOST HANDLING
				if (runtime.strRequestedHost && runtime.strRequestedHost.length) {
					// REQUESTED HOST PASSED IN
					//V1 - WHITELIST: if (runtime.allowedHosts.indexOf(runtime.strRequestedHost.toLowerCase()) > -1) {
					// V2 - SIMPLE REGEX ON REQUESTED HOSTNAME
					var match = runtime.strRequestedHost.match(/.cdc.gov$/gi);
					if (match && match.length) {
						// REQUETED HOSTS MATCHED WHITE LIST
						runtime.strHost = runtime.strRequestedHost;
					}
				}

				if (runtime.strConfigPath.length) {
					$.ajax({
						type: 'GET',
						url: runtime.strConfigPath,
						data: { noCache: objCommon.s4() },
						dataType: 'json',
						timeout: 300,
						context: $('body'),
						success: function(data){
							runtime.strMenuAlign = data.menuMode || 'center';
							runtime.strImagePath = data.imagePath || "/TemplatePackage/contrib/widgets/imageShare/img.png";
							runtime.strImageName = data.imageName || "no_image_specified";
							runtime.strImageAlt = data.imageAlt || runtime.strImageName;
							runtime.str508Link = data.accessPath || "";
							runtime.strPdfLink = data.pdfPath || "";
							runtime.strMaxWidth = data.widgetMaxWidth || "";
							fctCallback();
						},
						error: function(xhr, type){
							alert('Ajax error!')
						}
					})
				} else {
					runtime.strMenuAlign = objCommon.getCallParam('menuMode') || 'center';
					runtime.strImagePath = objCommon.getCallParam('imagePath') || "/TemplatePackage/contrib/widgets/imageShare/img.png";
					runtime.strImageName = objCommon.getCallParam('imageName') || "no_image_specified";
					runtime.strImageAlt = objCommon.getCallParam('imageAlt') || runtime.strImageName;
					runtime.str508Link = objCommon.getCallParam('accessPath') || "";
					runtime.strPdfLink = objCommon.getCallParam('pdfPath') || "";
					runtime.strMaxWidth = objCommon.getCallParam('widgetMaxWidth') || "";
					fctCallback();
				}
			};

			function initPage () {

				// FIRE INIT HANDLERS
				initEmbedCode();
				initEventHandlers();
				initMenuIcons();
				initMetrics();

				// TRIGGER RESIZE FOR INITIAL LOAD
				if (window.CDC.Widget.events.menuResize) {
					window.CDC.Widget.events.menuResize();
				}

				runtime.jqCache.iconMenu.addClass('icon-count-' + runtime.intMenuIcons);
			};

			// TRIGGER MASTER INIT
			initConfig.call(self, function() {
				initPage.call(self);
			});
		});
	};

} (window, document, $));