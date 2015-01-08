'use strict';

var cbeFilters = angular.module('cbeFilters', [])
	.filter('removeWhitepace', function () {
        return function (text) {
			return text.replace(/\s+/g, '');
        };
	});
