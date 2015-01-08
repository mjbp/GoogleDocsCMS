'use strict';

var module = angular.module('geolocation', []).constant('geolocation_msgs', {
        'errors.location.unsupportedBrowser':'Browser does not support location services',
        'errors.location.permissionDenied':'You have rejected access to your location',
        'errors.location.positionUnavailable':'Unable to determine your location',
        'errors.location.timeout':'Service timeout has been reached'
});

module.factory('Geolocation', ['$q', '$window', function($q, $window) {
    var self = this,
		r = 6371000;
	
	this.deferred = $q.defer();
	
    this.config = {
        enableHighAccuracy: true,
        maximumAge: 5000
    };

	this.success = function(position) {
		self.deferred.resolve(position);
	};
		
	this.error = function(error) {
		console.log('not allowed');
		self.deferred.reject(error);
	};
	
    /**
     * get one time geolocation
     * @param callback
     */
    this.getLocation = function() {
		if ($window.navigator && $window.navigator.geolocation) {
			 $window.navigator.geolocation.getCurrentPosition(self.success, self.error, self.config);
		} else {
			self.error('Unsupported browser');
		}
		return self.deferred.promise;
    };
	
	
	/**
     * calculate distance
     * @param geo1
     * @param geo2
     * @returns {Number}
     */
    this.calculateDistance = function(geo1, geo2) {
        var a, c,
			dLat = self.toRad(geo1.latitude - +geo2.latitude),
			dLon = self.toRad(geo1.longitude - +geo2.longitude),
			lat1 = self.toRad(+geo2.latitude),
			lat2 = self.toRad(geo1.latitude);
		a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
		c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return self.metresToMiles(parseInt(r * c)).toFixed(2);
    };
    
	
	this.metresToMiles = function (m) {
		return m * 0.000621371192;
	};
	
    /**
     * math util to convert lat/long to radians
     * @param value
     * @returns {number}
     */
    this.toRad = function(value) {
        return value * Math.PI / 180;
    };

    /**
     * math util to convert radians to latlong/degrees
     * @param value
     * @returns {number}
     */
    this.toDeg = function(value) {
        return value * 180 / Math.PI;
    };
	
	
	
	return this;
}]);
	
    /**
     * update geolocation error handler
     * @param error
    
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
	
	
	
angular.module('geolocation',[]).constant('geolocation_msgs', {
	'errors.location.unsupportedBrowser':'Browser does not support location services',
	'errors.location.permissionDenied':'You have rejected access to your location',
	'errors.location.positionUnavailable':'Unable to determine your location',
	'errors.location.timeout':'Service timeout has been reached'
});

angular.module('geolocation')
  .factory('geolocation', ['$q','$rootScope','$window','geolocation_msgs',function ($q,$rootScope,$window,geolocation_msgs) {
	  var self = this,
		service = {};
	  
	  
	  service.getLocation = function(opts) {
      	var deferred = $q.defer();
        
		  if ($window.navigator && $window.navigator.geolocation) {
			  $window.navigator.geolocation.getCurrentPosition(function(position){
				  $rootScope.$apply(function(){deferred.resolve(position);});
          	  }, function(error) {
				  switch (error.code) {
					  case 1:
						  $rootScope.$broadcast('error',geolocation_msgs['errors.location.permissionDenied']);
                		  $rootScope.$apply(function() {
							  deferred.reject(geolocation_msgs['errors.location.permissionDenied']);
                });
                break;
              case 2:
                $rootScope.$broadcast('error',geolocation_msgs['errors.location.positionUnavailable']);
                $rootScope.$apply(function() {
                  deferred.reject(geolocation_msgs['errors.location.positionUnavailable']);
                });
                break;
              case 3:
                $rootScope.$broadcast('error',geolocation_msgs['errors.location.timeout']);
                $rootScope.$apply(function() {
                  deferred.reject(geolocation_msgs['errors.location.timeout']);
                });
                break;
            }
          }, opts);
        }
        else
        {
          $rootScope.$broadcast('error',geolocation_msgs['errors.location.unsupportedBrowser']);
          $rootScope.$apply(function(){deferred.reject(geolocation_msgs['errors.location.unsupportedBrowser']);});
        }
        return deferred.promise;
      }
    };
}]);
	*/
