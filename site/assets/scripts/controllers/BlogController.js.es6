angular.module('timBurkeCo').controller('BlogController', (
    $location,
    $rootScope,
    $sanitize,
    $scope,
    page
) => {

    _.each(page.items, (post) => {
        post.content = $sanitize(post.content)
    })

    $scope.posts = page.items
    $scope.next = page.nextPage
    $scope.previous = page.previousPage

    $scope.navigate = (page) => {
        $location.url(`/blog/${page}`)
    }
})
