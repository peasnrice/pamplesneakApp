angular.module('starter.controllers', [])

.controller('PlayCtrl', function($scope, $state) {
  $scope.createGame = function() {
    $state.go('tab.create-game');
  } 
})

.controller('CreateGameCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $state, $http) {

  $scope.settings = {
    enableFriends: true
  };

  $scope.logout = function () {
    $http.post("http://localhost:8100/rest-auth/logout/").then(function(success) {
          $http.defaults.headers.common['Authorization'] = undefined;
          console.log("logout succesful");
          $state.go('signin');
        }, function(err) {
          console.error('ERR', err);
          $state.go('signin');
    });
  };

})

.controller('SignInCtrl', function($scope, $state, $http, $cordovaOauth, $cordovaFacebook) {

  $scope.facebookLogin = function () {
    $scope.access_token = "";
    $cordovaFacebook.getLoginStatus().then(function(success) {
      $scope.access_token = success.authResponse.accessToken;
      // console.log($scope.access_token);
      $http.post("http://localhost:8100/rest-auth/facebook/", {access_token: $scope.access_token}).then(function(success) {
        $scope.app_token = success.data.key;
        // console.log($scope.app_token);
        $http.defaults.headers.common['Authorization'] = "Token " + $scope.app_token;
        // console.log("we got code: " + $scope.app_token);
        console.log("Success");
        $state.go('tab.play');
        }, function(error) {
          console.log("couldn't get django api key");
      });
    }, function (error) {
      // console.log("not already logged in");
      $cordovaFacebook.login(["public_profile", "email", "user_friends"]).then(function(success) {
          $scope.access_token = success.authResponse.accessToken;
          $http.post("http://localhost:8100/rest-auth/facebook/", {access_token: $scope.access_token}).then(function(success) {
            $scope.app_token = success.data.key;
            // console.log($scope.app_token);
            $http.defaults.headers.common['Authorization'] = "Token " + $scope.app_token;
              console.log("Success");
              $state.go('tab.play');
            // console.log("we got code: " + $scope.app_token);
            }, function(error) {
              // console.log("couldn't get django api key");
          });
       }, function (error) {
        console.log("facebook login failed");
       });
     });
   };
   
  $scope.logout = function () {
    $http.post("http://localhost:8100/rest-auth/logout/").then(function(success) {
          $http.defaults.headers.common['Authorization'] = undefined;
          console.log("logout succesful");
          $state.go('signin');
        }, function(err) {
          console.error('ERR', err);
          $state.go('signin');
    });
  };
});