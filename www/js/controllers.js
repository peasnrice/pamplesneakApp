(function(){

  var app = angular.module('starter.controllers', []);

  app.controller('LoginCtrl', function($scope, $http, $cordovaOauth, $cordovaFacebook) {

    $scope.facebookLogin = function () {
      $cordovaFacebook.login(["public_profile", "email", "user_friends"])
	    .then(function(success) {
	    	console.log("Facebook authentication succesful");
        console.log("START:" + success.authResponse.accessToken + ":END");
        $http.post("http://localhost:8100/rest-auth/facebook/", {access_token: success.authResponse.accessToken}).then(function(resp) {
          $scope.access_token = resp.data.key;
                $http.defaults.headers.common['Authorization'] = "Token " + app_token;
          console.log("key: " + $scope.access_token);
          }, function(err) {
            //error
        });
      }, function (error) {
	        console.log("Facebook authentication failed");
	    });

  	};

    $scope.testGet = function () {
      app_token = $scope.access_token
      $http.get("http://localhost:8100/phrases/").then(function(resp) {
          $scope.status = resp.data;
          }, function(err) {
            console.error('ERR', err);
      });
    };

    $scope.testAuthToken = function () {
      $http.get("http://localhost:8100/games/", {Token: $scope.access_token }).then(function(resp) {
          $scope.status = resp.data;
          }, function(err) {
            console.error('ERR', err);
      });
    };

    $scope.logout = function () {
      $http.post("http://localhost:8100/rest-auth/logout/").then(function(resp) {
          $scope.access_token = "";
          $scope.status = resp.data;
          }, function(err) {
            console.error('ERR', err);
      });
    };

    $scope.googleLogin = function () {
      $cordovaOauth.google("14404712483-fujepcqll6meifa5f0bpi2s73qaat4f5.apps.googleusercontent.com", ["email"]).then(function (result) {
        $scope.oauthResult = result;
        console.log(result.access_token);
      }, function (error) {
        $scope.oauthResult = "OAUTH ERROR (see console)";
        console.log(error);
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
