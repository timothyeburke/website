angular.module('timBurkeCo').factory('BlogResource', (
    $http
) => {
    const baseUrl = 'https://www.googleapis.com/blogger/v3/blogs'
    const blogId = '931177938178452143'
    const key = 'key=AIzaSyAlwRZ1LQmwdhGxhLMdglB4p7utWFWaV90'

    function listBlogPosts() {
        const url = `${baseUrl}/${blogId}/posts/?${key}`
        return $http.get(url).then((response) => response.data)
    }

    function listBlogPostsByPage(pageToken) {
        const url = `${baseUrl}/${blogId}/posts/?${key}&pageToken=${pageToken}`
        return $http.get(url).then((response) => response.data)
    }

    return {
        listBlogPosts,
        listBlogPostsByPage
    }
})
