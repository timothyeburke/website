angular.module('timBurkeCo').factory('BlogPostsResolver', (
    BlogResource
) => {
    return BlogResource.listBlogPosts()
})
