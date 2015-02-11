(function() {
	'use strict';

	var App = angular.module('GDApp', [
			'gdAppFilters',
			'gdDirectives',
			'googleDocs'
		])
		.controller('GDAppController', ['$scope', '$window', '$anchorScroll', 'GoogleDocs', function($scope, $window, $anchorScroll, GoogleDocs) {
			//Menu get/set, to be refactored out to directive(s)
			$scope.setMenuItem = function(index) {
				var currentMenuItem,
					activeClassName,
					currentActiveItem,
					removeCurrentlyActive = function() {
						var currentActiveItem = document.querySelector('.nav-primary--current');
						if(!!currentActiveItem) {
							document.querySelector('.nav-primary--current').className = currentActiveItem.className.split(' nav-primary--current').join('');
						}
					};
				if (index === 0) {
					removeCurrentlyActive();
					return;
				}
				activeClassName = document.querySelectorAll('.nav-primary a')[$scope.current -1].className;
				if (!~activeClassName.indexOf('nav-primary--current')) {
					removeCurrentlyActive();
					document.querySelectorAll('.nav-primary a')[$scope.current -1].className += ' nav-primary--current';
				}
			};
			
			$scope.checkActiveMenuItem = function(top) {
				var i = 0,
					pages = document.querySelectorAll('.page'),
					current = 0;
				angular.forEach(pages, function(p) {
					current = ((top >= p.offsetTop) && (top < (p.offsetTop + p.offsetHeight)) && i) || current;
					i++;
				});
				$scope.current = current;
				$scope.setMenuItem($scope.current);
				
			};
			
			$scope.date = new Date();
			$scope.loaded = {
				data : false,
				failed : false
			};
			
			GoogleDocs.getContent()
				.then(function(results) {
					$scope.pages = results;
					$scope.loaded.data = true;
					//$scope.menu = menu(results);
					//console.log(results);
				},
				function(results) { 
					$scope.loaded.failed = true;
				});
		}]);
}());

