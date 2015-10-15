angular.module('timBurkeCo').factory('BlogPostsResolver', (
    $q,
    $location,
    $route,
    BlogPostService
) => {
    return BlogPostService.getPage($route.current.params.page).catch(() => {
        $location.url('/blog')
        return $q.reject()
    })
})
