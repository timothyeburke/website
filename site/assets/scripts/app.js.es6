angular.module('timBurkeCo', [
    'ngRoute'
]).config([
    '$routeProvider',

    (
        $routeProvider
    ) => {
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
    }
])
