var CONFIG = require('../../js/CONFIG');

function Controller(homeService, $location) {
	var self = this;

	self.loaderYouth = true;
	self.loaderInjury = true;
	self.loaderResources = true;
	self.loaderMedia = true;
	self.loaderTwitter = true;

	self.messageSlides = $('.rotatingText ul li');

	// YOUTH SPORTS
	homeService.getCollection(132434).then((function (response) {
		self.youthData = response.data[0].children;
		self.loaderYouth = false;
	}));

	// BRAIN INJURY BASICS
	homeService.getCollection(132380).then((function (response) {
		self.injuryData = response.data[0].children;
		self.loaderInjury = false;
	}));

	// RESOURCES
	homeService.getCollection(132451).then((function (response) {
		self.resourcesData = response.data[0].children;
		self.loaderResources = false;
	}));

	// MEDIA CAROUSEL
	homeService.getCollection(132477).then((function (response) {
		self.mediaData = response.data[0].children;
		self.loaderMedia = false;
	}));

	// TWITTER
	homeService.getLegacyFeed(315).then((function (response) {
		self.twitterData = response;
		self.loaderTwitter = false;
	}));

	// Stubbing Out 3.0 Call for Proxy Feed / Twitter
	//homeService.getLegacyFeed(363520).then((function (response) {
	//	self.twitterData = response;
	//	self.loaderTwitter = false;
	//	console.log(response);
	//}));

}

module.exports = Controller;