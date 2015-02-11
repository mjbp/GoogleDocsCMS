'use strict';

var module = angular.module('gdDirectives', [])
	.directive('main', ['$window', function ($window) {
		return {
			restrict: 'A',
			link: function ($scope, element, attrs) {
				var raw = element[0];
				element.bind('scroll', function () {
					$scope.checkActiveMenuItem(this.scrollTop);
				});
			}
		};
	}]);

