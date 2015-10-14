angular.module('timBurkeCo', [
    'ngRoute',
    'ngSanitize'
]).config(
    (
        $routeProvider,
        BlogPostsResolverProvider
    ) => {
        const blogPostsResolver = BlogPostsResolverProvider.$get

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
                controller: 'BlogController',
                templateUrl: 'templates/blog.html',
                resolve: {
                    posts: blogPostsResolver
                }
            })
    }
)
