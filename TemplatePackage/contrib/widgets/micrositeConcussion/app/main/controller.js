function Controller ( $location, $scope ) {
	var self = this;

	self.systemTitle = 'CDC - Concussion Microsite';
	self.systemHeadline = 'Get a HEADS UP';
	self.systemSubHeadline = 'Help Get Concussion Info on Every Sideline';

	self.demoMode = true;
	
	// This variable will only be set inside the widget framework
	if (window.cdcCommon) {
		// This is reading all the parameters set on the widget embed code
		self.embedParams = window.cdcCommon.runtime.callParams;
	} else {
		// Set Defaults
		self.embedParams = {};
		self.embedParams.cdcSport = 'all';
		self.embedParams.cdcTheme = 'theme4';
	}

	self.$back = function () {
		window.history.back();
	};
}

Controller.prototype.logInteraction = function (metric) {
	if (window.cdcMetrics) {
		cdcMetrics.trackEvent(metric);
	} else {
		console.log('Metrics offline - widget will log:');
		console.log(metric);
	}
};


module.exports = Controller;