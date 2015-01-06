'use strict';

var cbeControllers = angular.module('cbeControllers', []);

cbeControllers.controller('CbeAppController', ['$scope', '$rootScope', '$location', '$http', function($scope, $rootScope, $location, $http) {
	//show loading icon when loading..
	//also enable pull down to load/restart goelocation stuff
	/*
	geolocation.getLocation().then(function(data){
      	$scope.coords = {lat:data.coords.latitude, long:data.coords.longitude};
		console.log(data.coords.latitude + ', ' + data.coords.longitude);
    });*/
	$http.get('/assets/data/data.json').success(function(data) {
    	$rootScope.locations = data;
  	});
	$scope.filterable = ($location.path === 'list/' || '/map');
	$scope.typeFilterSelect = function (filter) {
		if (filter === $scope.typeFilter) {
			$scope.typeFilter = undefined;
		} else {
			$scope.typeFilter = filter;
		}
	};
}]);


cbeControllers.controller('CbeListController', ['$scope', function($scope, $routeParams) {
	$scope.test = 'testing, tesing, one, two...';
  }
]);

/* 
UI
1. Icons for shop and bar to use on map/list

(use shopping bag for shop and schooner for bar on map??)


CODE
Modify data from json

1. get current location and calculate distance
//http://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates-shows-wrong
2. get opening times from google places api if listed 
//http://stackoverflow.com/questions/20735016/how-to-get-opening-hours-from-google-places-api

*/