angular.module('timBurkeCo').controller('NavController', [
    '$location',
    '$rootScope',
    '$scope',

    (
        $location,
        $rootScope,
        $scope
    ) => {

        $rootScope.$on('$routeChangeSuccess', () => {
            $scope.isRoot = $location.path() === '/'
        })

        $scope.isRoot = $location.path() === '/'
        $scope.isActive = (route) => route === $location.path()
    }
])
