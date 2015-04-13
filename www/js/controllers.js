angular.module('starter.controllers', [])

.controller('PlayCtrl', function($scope, $state) {
  $scope.createGameMenu = function() {
    $state.go('tab.create-game');
  }; 
  $scope.joinGameMenu = function() {
    $state.go('tab.list-games');
  }; 
})

.controller('CreateGameCtrl', function($scope, $http, $stateParams, $state, gameService) {
  $scope.createGame = function (game) {
    $http.post("http://localhost:8100/games/", {name: game.name, motto: game.motto, passcode: game.passcode, nickname: game.nickname}).then(function(success) {
      console.log("game created succesfully");
      gameService.getGames().then(function(games){
        console.log(gameService.getGame(success.data.game_id).name);
        $state.go('tab.play-game', { "gameId": success.data.game_id});
      });
    }, function(err) {
      console.error(error.data);
    });
  };   
})

.filter("toArray", function(){
    return function(obj) {
        var result = [];
        angular.forEach(obj, function(val, key) {
            result.push(val);
        });
        return result;
    };
})

.controller('ListGamesCtrl', function($scope, $http, $state, gameService) {
  gameService.getGames().then(function(games){
    $scope.games = games;
  });

})

.controller('PlayGameCtrl', function($scope, $http, $stateParams, gameService) {
  console.log($stateParams.gameId);
  $scope.game = gameService.getGame($stateParams.gameId);
})

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
        // $scope.app_token = success.data.key;
        console.log(window.localStorage['app_token']);
        window.localStorage['app_token'] = success.data.key;
        $http.defaults.headers.common['Authorization'] = "Token " + window.localStorage['app_token'];
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
            window.localStorage['app_token'] = success.data.key;
            console.log(window.localStorage['app_token']);
            $http.defaults.headers.common['Authorization'] = "Token " + window.localStorage['app_token'];
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