/* beautify preserve:start */
/* jshint ignore:start */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-25870009-2', 'auto');
ga('send', 'pageview');
/* jshint ignore:end */
/* beautify preserve:end */

var timBurkeCo = angular.module('timBurkeCo', ['ngRoute']);

timBurkeCo.config(function($routeProvider) {
	'use strict';

	$routeProvider
		.when('/', {
			templateUrl: 'templates/home.html'
		})
		.when('/home', {
			templateUrl: 'templates/home.html'
		})
		.when('/work', {
			templateUrl: 'templates/work.html'
		})
		.when('/projects/:page?', {
			templateUrl: function(params) {
				return params.page ? 'templates/projects/' + params.page + '.html' : 'templates/projects/projects.html';
			}
		})
		.when('/blog', {
			templateUrl: 'templates/blog.html'
		})
	;
});

timBurkeCo.controller('navController', function($rootScope, $scope, $location) {
	'use strict';

	$rootScope.$on('$routeChangeSuccess', function() {
		$scope.isRoot = $location.path() === '/';
	});
	$scope.isRoot = $location.path() === '/';
	$scope.isActive = function(route) {
		return route === $location.path();
	};
});

$(document).ready(function() {
	'use strict';

	$('#dogelink').dogeify();
});