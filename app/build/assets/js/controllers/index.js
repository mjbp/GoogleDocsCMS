/*global console, angular*/
'use strict';

var cbeControllers = angular.module('cbeControllers', [])

	.controller('CbeAppController', ['$scope', '$location', 'Geolocation', '$window', 'DataService', 'Map', '$q', function($scope, $location, Geolocation, $window, DataService, Map, $q) {
		/*
		 * @roadmap
		 * - trigger overlay when on single location map page
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
		$scope.stringFilter = {name: ''};
		$scope.typeFilter = '';
		
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
		if($scope.loaded.data) {
			$scope.location = $scope.locations.filter(function(l) { return l.id === $routeParams.locationId; })[0];
		} else {
			$scope.$on('asyncComplete', function() {
				$scope.location = $scope.locations.filter(function(l) { return l.id === $routeParams.locationId; })[0];
			});
		}
	}])

	//Map page
	.controller('CbeMapController', ['$scope', 'Geolocation', 'Map', '$routeParams', function($scope, Geolocation, Map, $routeParams) {
		var markers,
			loadMap = function(d) {
				var mapVars = {
					locations : (!!$routeParams.locationId ? d.filter(function (l) { return l.id === $routeParams.locationId; }).splice(0,1) : d),
					person: (!!$scope.loaded.geo && $scope.person) || null,
					trigger: !!$routeParams.locationId
				};
				Map.init(mapVars);
			},
			initFilter = function(locations) {
				$scope.$watch('[stringFilter.name, typeFilter]', function(newV, oldV) {
					var filteredLocations = $scope.locations;
						
					if ($scope.stringFilter !== undefined && $scope.stringFilter.name !== '' && $scope.stringFilter.name !== undefined) {
						filteredLocations = filteredLocations.filter(function(l) {
							var re = new RegExp($scope.stringFilter.name, 'gi');
							return l.name.match(re);
						});
					}
					if ($scope.typeFilter !== '' && $scope.typeFilter !== undefined) {
						filteredLocations = filteredLocations.filter(function(l) {
							return l.type === $scope.typeFilter;
						});
					}
					
					Map.refresh({
						locations : filteredLocations,
						person: (!!$scope.loaded.geo && $scope.person) || null
					});
				});
			};
		if($scope.loaded.data) {
			loadMap($scope.locations);
			!$routeParams.locationId && initFilter($scope.locations);
			
		} else {
			$scope.$on('asyncComplete', function() {
				loadMap($scope.locations);
				!$routeParams.locationId && initFilter($scope.locations);
			});
		}
		
	}]);

/* 
UI
1. Icons for shop and bar to use on map/list

(use shopping bag for shop and schooner for bar on map??)




CODE
Google maps
- directive for map





CONTENT
Review bars
Add Wetherspoons?
For each location - key words, and longer description, former on list, latter on detail


//whatpub
Starbar
Old Chain Pier
Starbank Inn
Clarks bar
Smithies
Cross and Corner
Other Place
Woodland Creatures
Brass Monkey
Cask and Still
Jolly Judge

//shops


	{"name":"The Grey Horse",
   	  "id" : "the-grey-horse",
		"taps" : {
			"keg" : "6",
			"cask" : "5"
		},
   		"address": "20 Main Street, Balerno",
		"website" : "greyhorsebalerno.com",
		"telephone" : "131 449 2888",
		"latitude" : "55.883754",
		"longitude" : "-3.338715",
		"description" : "Cosy real ale pub in the heart of Balerno",
   		"type" : "bar"
	},
	
	

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