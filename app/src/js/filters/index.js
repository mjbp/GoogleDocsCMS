'use strict';

var gdAppFilters = angular.module('gdAppFilters', [])
	.filter('removeWhitepace', function () {
        return function (text) {
			return text.replace(/\s+/g, '');
        };
	})
	.filter('hyphenate', function () {
        return function (text) {
			return text.replace(/\s+/g, '-');
        };
	});

