(function(){

  var app = angular.module('starter.controllers', []);

  app.controller('LoginCtrl', function($scope, $http, $cordovaOauth, $cordovaFacebook) {

    $scope.facebookLogin = function () {
      $scope.access_token = "";
      $cordovaFacebook.getLoginStatus().then(function(success) {
        $scope.access_token = success.authResponse.accessToken;
        $http.post("http://localhost:8100/rest-auth/facebook/", {access_token: $scope.access_token}).then(function(success) {
          $scope.app_token = success.data.key;
          console.log($scope.app_token);
          $http.defaults.headers.common['Authorization'] = "Token " + $scope.app_token;
          console.log("we got code: " + $scope.app_token);
          }, function(error) {
            console.log("couldn't get django api key");
        });
      }, function (error) {
        console.log("not already logged in");
        $cordovaFacebook.login(["public_profile", "email", "user_friends"]).then(function(success) {
            $scope.access_token = success.authResponse.accessToken;
            $http.post("http://localhost:8100/rest-auth/facebook/", {access_token: $scope.access_token}).then(function(success) {
              $scope.app_token = success.data.key;
              console.log($scope.app_token);
              $http.defaults.headers.common['Authorization'] = "Token " + $scope.app_token;
              console.log("we got code: " + $scope.app_token);
              }, function(error) {
                console.log("couldn't get django api key");
            });
          }, function (error) {
            console.log("facebook login failed");
          });
        });
      };
    

    $scope.testGet = function () {
      $http.get("http://localhost:8100/phrases/").then(function(resp) {
          $scope.status = resp.data;
          }, function(err) {
            console.error('ERR', err);
      });
    };

    $scope.testAuthToken = function () {
      $http.get("http://localhost:8100/games/", {Token: $scope.app_token }).then(function(resp) {
          $scope.status = resp.data;
          }, function(err) {
            console.error('ERR', err);
      });
    };

    $scope.logout = function () {
      $http.post("http://localhost:8100/rest-auth/logout/").then(function(success) {
            $http.defaults.headers.common['Authorization'] = undefined;
            console.log("logout succesful");
          }, function(err) {
            console.error('ERR', err);
      });
    };
  });

  app.controller('DashCtrl', function($scope) {})

  .controller('ChatsCtrl', function($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
      Chats.remove(chat);
    }
  });

  app.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  });

  app.controller('AccountCtrl', function($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });

})();
