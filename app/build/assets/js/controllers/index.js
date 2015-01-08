'use strict';

var cbeControllers = angular.module('cbeControllers', [])

	.controller('CbeAppController', ['$scope', '$location', 'Geolocation', '$window', 'DataService', 'Map', '$q', function($scope, $location, Geolocation, $window, DataService, Map, $q) {
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
			var promises = [],
				position;
			
			promises.push(Geolocation.getLocation());
			promises.push(Map.asyncGoogleMapAPI());
			
			$q.$allSettled(promises).then(function(results) {
				position = results[0];
				if (position.coords) {
					$scope.loaded.geo = true;
					$scope.person = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
						type: 'person',
						id: 'Person'
					};
					//get distance to each location from current position and add to location object
					locations.map(function(location) { 
						location.distance = Geolocation.calculateDistance(position.coords, {'latitude': location.latitude, 'longitude' : location.longitude});
						return location;
					});
					//sort by distance, ascending
					locations.sort(function(a,b) { return parseFloat(a.distance) - parseFloat(b.distance); } );
				}
				
				$scope.locations = locations;
				
				$scope.loaded.data = true;
				
				//move into directive
				$scope.typeFilterSelect = function(filter) {
					if (filter === $scope.typeFilter) {
						$scope.typeFilter = undefined;
					} else {
						$scope.typeFilter = filter;
					}
				};
				$scope.toggleFilter = function() {
					$scope.filterOn = !$scope.filterOn;
					if (!$scope.filterOn) {
						$scope.typeFilter = $scope.stringFilter = undefined;
					}
				};
				$scope.filterable = function() {
					return ($location.path() === '/list' || $location.path() === '/map');
				};
				
				$scope.$broadcast('asyncComplete');
			}, 
			function(results) { 
				console.log('allSettled failed'); 
			});
		}, function(error) {
			$scope.loaded.failed = true;
		});
		
		$scope.navIsActive = function(path) {
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
		$scope.location = $scope.locations.filter(function(l) { return l.id === $routeParams.locationId; })[0];
	}])

	//Map page
	.controller('CbeMapController', ['$scope', 'Geolocation', 'Map', '$routeParams', function($scope, Geolocation, Map, $routeParams) {
		var markers,
			loadMap = function(d) {
				var mapVars = {
					locations : (!!$routeParams.locationId ? d.filter(function (l) { return l.id === $routeParams.locationId; }).splice(0,1) : d)
				};
				if (!!$scope.loaded.geo) {
					mapVars.person = $scope.person;
				}
				Map.init(mapVars);
			};
		if($scope.loaded.data) {
			loadMap($scope.locations);
		} else {
			$scope.$on('asyncComplete', function() {
				loadMap($scope.locations);
			});
		}
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