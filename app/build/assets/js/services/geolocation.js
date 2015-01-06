'use strict';

var module = angular.module('geolocation', []).constant('geolocation_msgs', {
        'errors.location.unsupportedBrowser':'Browser does not support location services',
        'errors.location.permissionDenied':'You have rejected access to your location',
        'errors.location.positionUnavailable':'Unable to determine your location',
        'errors.location.timeout':'Service timeout has been reached'
});

module.factory('geolocation', function() {
    var self = this,
		service = {};

	/* 
	
	1. set errors:
	 'errors.location.unsupportedBrowser':'Browser does not support location services',
        'errors.location.permissionDenied':'You have rejected access to your location',
        'errors.location.positionUnavailable':'Unable to determine your location',
        'errors.location.timeout':'Service timeout has been reached'
		
	2. var deferred = $q.defer();
	
	return deferred.promise;
	
	//return promise object
	
	//broadcast any errors to rootScope - listen for that and throw error/or just ignore and do not show the distance box???
	
	*/
	
	
	
	
	
    service.config = {
        enableHighAccuracy: true,
        maximumAge: 5000
    };

    /**
     * get one time geolocation
     * @param callback
     */
    service.getCurrent = function(callback) {
        navigator.geolocation.getCurrentPosition(callback, self.error, self.config);
    };
	
	
    /**
     * update geolocation error handler
     * @param error
     */
    service.error = function(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                self.listeners.forEach( function(l) {
                    l.apply(this, [{error: true, message: "User denied the request for Geolocation."}]);
                });
                break;
            case error.POSITION_UNAVAILABLE:
                self.listeners.forEach( function(l) {
                    l.apply(this, [{error: true, message: "Location information is unavailable."}]);
                });
                break;
            case error.TIMEOUT:
                self.listeners.forEach( function(l) {
                    l.apply(this, [{error: true, message: "The request to get user location timed out."}]);
                });
                break;
            case error.UNKNOWN_ERROR:
                self.listeners.forEach( function(l) {
                    l.apply(this, [{error: true, message: "An unknown error occurred."}]);
                });
                break;
        }
    };
	
	return service;
});