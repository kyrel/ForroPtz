var app = angular.module('app', []);

app.controller('AuthController', ['$scope', function($scope) {
    $scope.signIn = function(data) {
    };

    $scope.signOut = function() {
        $.ajax({ url: '/auth/signOut', type: 'POST' }).done(function() { window.location.reload(); });
    };
}]);