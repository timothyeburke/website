angular.module('timBurkeCo').factory('BlogPostService', (
    $q,
    BlogResource
) => {

    const pages = {}

    function savePage(data, page) {
        data.nextPage = data.nextPageToken ? page + 1 : null
        data.previousPage = page - 1 < 1 ? null : page - 1
        pages[page] = data
        return pages[page]
    }

    function getPage(page) {
        if (!page) {
            page = 1
        }
        if (pages[page]) {
            return $q.resolve(pages[page])
        } else if (page === 1) {
            return BlogResource.listBlogPosts().then((data) => {
                return savePage(data, page)
            })
        } else if (_.get(pages[page - 1], 'nextPageToken')) {
            return BlogResource.listBlogPostsByPage(_.get(pages[page - 1], 'nextPageToken')).then((data) => {
                return savePage(data, page)
            })
        }
        return $q.reject()
    }

    return {
        getPage
    }
})
