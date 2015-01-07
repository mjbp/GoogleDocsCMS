var module = angular.module('dataService', ['ngResource']);

module.factory('DataService', ['$resource', function($resource){
    return $resource('/assets/data/data.json',{ }, {
    	getData: {method:'GET', isArray: true}
  	});
 }]);