var app = angular.module('app', []);

app.controller('AuthController', ['$scope', '$document', function ($scope, $document) {

    $document.ready(function () {
        if ($("#vk_auth").length) {
            VK.init({ apiId: 4580391 });
            VK.Widgets.Auth("vk_auth", {
                width: "200px",
                onAuth: function(data) {
                    //alert('user ' + data['uid'] + ' authorized');
                    //console.log(data);
                    $.ajax({ url: '/auth/signIn', type: 'POST', data: data }).done(function() {
                        window.location.reload();
                    });
                }
            });
        }
    });    

    $scope.signIn = function (data) {
    };

    $scope.signOut = function() {
        $.ajax({ url: '/auth/signOut', type: 'POST' }).done(function() { window.location.reload(); });
    };
}]);