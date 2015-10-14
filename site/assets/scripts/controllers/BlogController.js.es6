angular.module('timBurkeCo').controller('BlogController', (
    $rootScope,
    $sanitize,
    $scope,
    posts
) => {
    _.each(posts, (post) => {
        post.content = $sanitize(post.content)
    })
    $scope.posts = posts
})
