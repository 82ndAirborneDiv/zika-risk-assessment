function Controller(detailService, $location, $routeParams) {
	var self = this;

	self.mediaId = $routeParams.id;

	detailService.getMediaItem(self.mediaId).then((function (response) {
		
		var htmlDoc = response.data.content;

		// Attach Accordion support if found
		if ($(htmlDoc).find('.accordion').length > 0) {
			var launch = '<script>$(document).ready(function() { $(".accordion").accordion() });</script>';
			$('head').append('<link rel="stylesheet" href="//tools.cdc.gov/TemplatePackage/3.0/css/lib/jquery-ui/jquery-ui.css">');
			htmlDoc = htmlDoc + launch;
		}

		// Attach Slider support if found
		if ($(htmlDoc).find('.thumbnail-slider').length > 0) {
			$('body').append('<script src="//tools.cdc.gov/TemplatePackage/3.0/js/modules/dynamic/flexslider.js"></script><script src="//tools.cdc.gov/TemplatePackage/3.0/js/libs/jquery.flexslider2.js"></script>');

			$('head').append('<link rel="stylesheet" href="//tools.cdc.gov/TemplatePackage/3.0/css/flexslider.css">');
			$('head').append('<link rel="stylesheet" href="//tools.cdc.gov/TemplatePackage/3.0/css/lib/flexslider.css">');

			var launchSlider = '<script> ';
			launchSlider += 'setTimeout(function() {';

			launchSlider += '$(\'.carousel\').flexslider({ ';
			launchSlider += 'animation: "slide", ';
			launchSlider += 'controlNav: false, ';
			launchSlider += 'animationLoop: false, ';
			launchSlider += 'slideshow: false, ';
			launchSlider += 'itemWidth: 210, ';
			launchSlider += 'itemMargin: 5, ';
			launchSlider += '}); ';

			launchSlider += '}, 500);';

			launchSlider += '</script>';
			htmlDoc = htmlDoc + launchSlider;
		}


		//if ($(htmlDoc).find('.tabs').length > 0) {
		//	var launchTab = '<script>setTimeout(function() { $(".tabs").tabs() }, 500);</script>';
		//	htmlDoc = htmlDoc + launchTab;
		//}

		if ($(htmlDoc).find('.youtube').length > 0) {
			$('body').append('<script src="//tools.cdc.gov/TemplatePackage/3.0/js/libs/jquery.fitvids.js"></script>');

			var launchFitVids = '<script>setTimeout(function() { $(".youtube").fitVids() }, 500);</script>';
			htmlDoc = htmlDoc + launchFitVids;
		}


		
		


		self.media = htmlDoc;
	}));
	
}

module.exports = Controller;