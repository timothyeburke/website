(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-25870009-2', 'auto');
ga('send', 'pageview');

var timBurkeCo = angular.module('timBurkeCo', ['ngRoute']);

timBurkeCo.config(function($routeProvider) {
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
		.when('/projects', {
			templateUrl: 'templates/projects/projects.html'
		})
		.when('/projects/mo', {
			templateUrl: 'templates/projects/mo.html'
		})
		.when('/projects/site', {
			templateUrl: 'templates/projects/site.html'
		})
		.when('/projects/foodtrucks', {
			templateUrl: 'templates/projects/foodtrucks.html'
		})
		.when('/projects/stats', {
			templateUrl: 'templates/projects/stats.html'
		})
		.when('/projects/replay', {
			templateUrl: 'templates/projects/replay.html'
		})
		.when('/projects/rain', {
			templateUrl: 'templates/projects/rain.html'
		})
		.when('/projects/ringtailhomework', {
			templateUrl: 'templates/projects/ringtailhomework.html'
		})
		.when('/projects/fizzbuzz', {
			templateUrl: 'templates/projects/fizzbuzz.html'
		})
		.when('/projects/annotate', {
			templateUrl: 'templates/projects/annotate.html'
		})
		.when('/projects/colorblind', {
			templateUrl: 'templates/projects/colorblind.html'
		})
		.when('/blog', {
			templateUrl: 'templates/blog.html'
		})
	;
});

timBurkeCo.controller('navController', function($rootScope, $scope, $location) {
	$rootScope.$on("$routeChangeSuccess", function() {
		$scope.isRoot = $location.path() === "/";
	});
	$scope.isRoot = $location.path() === "/";
	$scope.isActive = function(route) {
		return route === $location.path();
	}
});

$(document).ready(function () {
	$("#dogelink").dogeify();
});