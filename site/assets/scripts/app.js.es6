const timBurkeCo = angular.module('timBurkeCo', ['ngRoute'])

timBurkeCo.config(($routeProvider) => {
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
            templateUrl: (params) => {
                return params.page ? `templates/projects/${params.page}.html` : 'templates/projects/projects.html'
            }
        })
        .when('/blog', {
            templateUrl: 'templates/blog.html'
        })
})

timBurkeCo.controller('navController', ($rootScope, $scope, $location) => {
    $rootScope.$on('$routeChangeSuccess', function() {
        $scope.isRoot = $location.path() === '/'
    })
    $scope.isRoot = $location.path() === '/'
    $scope.isActive = function(route) {
        return route === $location.path()
    }
})

$(document).ready(() => {
    $('#dogelink').dogeify()
})
