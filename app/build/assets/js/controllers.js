'use strict';

var cbeControllers = angular.module('cbeControllers', []);

cbeControllers.controller('CbeAppController', ['$scope', '$rootScope', '$location', 'Geolocation', '$window', 'DataService', function($scope, $rootScope, $location, Geolocation, $window, DataService) {
	//show loading icon when loading..
	//also enable pull down to load/restart geolocation stuff
	/*
	geolocation.getLocation().then(function(data){
      	$scope.coords = {lat:data.coords.latitude, long:data.coords.longitude};
		console.log(data.coords.latitude + ', ' + data.coords.longitude);
    });*/
	/*
	$http.get('/assets/data/data.json').success(function(data) {
    	$rootScope.locations = data;
  	});
	*/
	
	$scope.loaded = {
		data : false,
		geo : false
	};
	
	$scope.filterOn = false;
	
	DataService.query(function(locations) {
		
		//Get current position
		Geolocation.getLocation()
		.then(function (position) {
			//console.log(position.coords.latitude + ', ' + position.coords.longitude);
			
			//add distnace from current position
			locations.map(function(location) { 
				location.distance = Geolocation.calculateDistance(position.coords, {'latitude': location.latitude, 'longitude' : location.longitude});
				return location;
			});
			
			//sort by distance
			locations.sort(function(a,b) { return parseFloat(a.distance) - parseFloat(b.distance); } );
			$scope.loaded = {
				geo : true,
				data : true
			};
			
		},
		function(errors) {
			$scope.loaded.data = true;
		});
		
		$scope.locations = locations;
		$scope.typeFilterSelect = function (filter) {
			if (filter === $scope.typeFilter) {
				$scope.typeFilter = undefined;
			} else {
				$scope.typeFilter = filter;
			}
		};
		$scope.toggleFilter = function () {
			$scope.filterOn = !$scope.filterOn;
			if (!$scope.filterOn) {
				$scope.typeFilter = $scope.stringFilter = undefined;
			}
		};

		$scope.filterable = function (){
			return ($location.path() === '/list' || $location.path() === '/map');
		};
	},
	function(error) {
		//handle here
	});
	
	
	
	
	$scope.navIsActive = function (path) {
		return (path === $location.path());
	};
	
	$scope.back = function() {
		$window.history.back();
	};
	
}]);


cbeControllers.controller('CbeListController', ['$scope', function($scope) {}]);

cbeControllers.controller('CbeDetailsController', ['$scope', '$routeParams', function($scope, $routeParams){
	$scope.location = $scope.locations.filter(function (l) { return l.id === $routeParams.locationId; })[0];
}]);

cbeControllers.controller('CbeMapController', ['$scope', function($scope) {
	
}]);

cbeControllers.controller('CbeMapDetailsController', ['$scope', '$routeParams', function($scope, $routeParams){
	$scope.location = $scope.locations.filter(function (l) { return l.id === $routeParams.locationId; })[0];
}]);

/* 
UI
1. Icons for shop and bar to use on map/list

(use shopping bag for shop and schooner for bar on map??)


CODE
Google maps
- load asynchronously
- new service/provider/factory??
- directive for map
- include map styling





CONTENT
Review bars
Add Wetherspoons?
For each location - key words, and longer description, former on list, latter on detail


//whatpub
Starbar
Clarks bar
Smithies
Cross and Corner
Other Place
Woodland Creatures
Brass Monkey
Cask and Still


Opening hours??


key words:
craft
real ale
food
nibbles
children
wetherspoons
dog-friendly
garden


*/