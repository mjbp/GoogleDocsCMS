'use strict';

/* App Module */
var CBEApp = angular.module('cbeApp', [
	'ngRoute',
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
        controller: 'CBEDetailsController'
      })./*
      when('/map', {
        templateUrl: '/assets/partials/map.html',
        controller: 'CBEMapCtrl'
      }).
      when('/map/:locationId', {
        templateUrl: '/assets/partials/map-detail.html',
        controller: 'CBEMapDetailCtrl'
      }).*/
      otherwise({
        redirectTo: '/list'
      });
  }]);