

function ServiceLocator() {
	
	var services = {};

	
	this.register = function (key, service) {
		if(services[key]!=undefined)
		{
			console.log('Service Locator Warning: Trying to overwrite registeration of key:'+ key);
		}
		services[key] = service;
	};

	this.resolve = function (key) {
		if(services[key]==undefined)
		{
			console.log('Service Locator Warning: Trying to resolve unregistered key:'+ key);
		}
		return services[key];
	};

	
	this.reset = function () {
		services = {};
	};
}
var locator = new ServiceLocator();
module.exports = locator;