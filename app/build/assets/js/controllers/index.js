'use strict';

var cbeControllers = angular.module('cbeControllers', [])

	.controller('CbeAppController', ['$scope', '$location', 'Geolocation', '$window', 'DataService', '$q', function($scope, $location, Geolocation, $window, DataService, $q) {
		/*
		 * @roadmap
		 * - add animations to loading and page transitions
		 * - enable pull down to load/restart geolocation stuff
		 *
		 */

		$scope.loaded = {
			data : false,
			geo : false,
			failed : false
		};

		$scope.filterOn = false;
		
		/*
		var promise1 = $http({method: 'GET', url: 'a/pi-one-url', cache: 'true'});
var promise2 = $http({method: 'GET', url: '/api-two-url', cache: 'true'});

$q.all([promise1, promise2]).then(function(data){
	console.log(data[0], data[1]);
});



		* Load map api and geolocation at the same time as multiple promises
		$q.$allSettled();
		*/
		
		
		DataService.query(function(locations) {
			//Get current position
			Geolocation.getLocation()
			.then(function (position) {
				//add distance from current position
				$scope.person = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					type: 'person',
					id: 'Person'
				};
				locations.map(function(location) { 
					location.distance = Geolocation.calculateDistance(position.coords, {'latitude': location.latitude, 'longitude' : location.longitude});
					return location;
				});

				//sort by distance
				locations.sort(function(a,b) { return parseFloat(a.distance) - parseFloat(b.distance); } );
				$scope.loaded.geo = true;
				$scope.loaded.data = true;
				
			}, function(errors) {
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

			$scope.filterable = function () {
				return ($location.path() === '/list' || $location.path() === '/map');
			};
		}, function(error) {
			$scope.loaded.failed = true;
			//handle here
		});
		
		$scope.navIsActive = function (path) {
			return (path === $location.path());
		};

		$scope.back = function() {
			$window.history.back();
		};

	}])

	//List page
	.controller('CbeListController', ['$scope', function($scope) {}])

	//Details page
	.controller('CbeDetailsController', ['$scope', '$routeParams', function($scope, $routeParams){
		$scope.location = $scope.locations.filter(function (l) { return l.id === $routeParams.locationId; })[0];
	}])

	//Map page
	.controller('CbeMapController', ['$scope', 'Geolocation', 'Map', function($scope, Geolocation, Map) {
		
		/* Geolocation stuff is required for current location, what if  they haven't visited another page and geo stuff hasn't loaded yet? 
		- need to set promise to get it from controller above
		*/
		$scope.loaded = {
			data : true,
			geo : false,
			failed : false
		};

		Map.asyncGoogleMapAPI()
			.then(function () {
				Map.init({
					locations : $scope.locations
				});
			}, function(errors) {
				$scope.loaded.failed = true;
				console.log(errors);
			});
		
	}])

	//Map detail page
	.controller('CbeMapDetailsController', ['$scope','Map', '$routeParams', function($scope, Map, $routeParams){
		$scope.location = $scope.locations.filter(function (l) { return l.id === $routeParams.locationId; })[0];
		Map.asyncGoogleMapAPI()
			.then(function (v) {
				Map.init({
					locations : [$scope.location]
				});
			}, function(errors) {
				console.log(errors);
			});
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