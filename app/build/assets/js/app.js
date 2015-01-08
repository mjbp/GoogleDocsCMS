'use strict';

/* App Module */
var CBEApp = angular.module('cbeApp', [
	'ngRoute',
	'dataService',
	'geolocation',
	'map',
	'cbeFilters',
  	'cbeControllers'
]);

CBEApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/list', {
        templateUrl: '/assets/partials/list.html',
        controller: 'CbeListController'
      }).
	 when('/location/:locationId', {
        templateUrl: '/assets/partials/detail.html',
        controller: 'CbeDetailsController'
      }).
      when('/map', {
        templateUrl: '/assets/partials/map.html',
        controller: 'CbeMapController'
      }).
      when('/map/:locationId', {
        templateUrl: '/assets/partials/map.html',
        controller: 'CbeMapDetailsController'
      }).
      otherwise({
        redirectTo: '/list'
      });
  }]);

