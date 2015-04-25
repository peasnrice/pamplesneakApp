angular.module('starter.controllers', [])

.controller('PlayCtrl', function($scope, $state) {
  $scope.createGameMenu = function() {
    $state.go('tab.create-game');
  }; 
  $scope.joinGameMenu = function() {
    $state.go('tab.list-games');
  }; 
})

.controller('CreateGameCtrl', function($scope, $http, $stateParams, $state, $ionicHistory, gameService) {
  $scope.createGame = function (game) {
    if(!game.passcode){
      game.passcode = "";
    }
    $http.post("http://localhost:8100/games/", {name: game.name, motto: game.motto, passcode: game.passcode, nickname: game.nickname}).then(function(success) {
      console.log("game created succesfully");
      gameService.getGames().then(function(games){
        console.log(gameService.getGame(success.data.game_id).name);
        $ionicHistory.nextViewOptions({
          disableAnimate: false,
          disableBack: true
        });
        game.name = "";
        game.motto = "";
        game.passcode = "";
        game.nickname = "";
        $state.go('tab.game-room', { "gameId": success.data.game_id});
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

.controller('ListGamesCtrl', function($scope, $http, $state, $timeout, gameService) {
  gameService.getGames().then(function(games){
    $scope.games = games;
  });
  $scope.doRefresh = function() {
    console.log('Refreshing!');
    $timeout( function() {
      //simulate async response
      gameService.getGames().then(function(games){
        $scope.games = games;
      });

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
  };
})

.controller('GameLobbyCtrl', function($scope, $http, $state, $stateParams, gameService) {
  console.log($stateParams.gameId);
  $scope.game = gameService.getGame($stateParams.gameId);
  $scope.players = $scope.game.players;
  console.log($scope.players);
 
  $scope.joinGame = function () {
    $http.post($scope.game.url + "join_game/").then(function(success){
      console.log("player created or just joined, either way we fine");
      console.log($scope.game.id);
      $state.go('tab.game-room', {"gameId": $scope.game.id});
    }, function(err){
      console.log(err);
    });
  }; 
})

.controller('GameRoomCtrl', function($scope, $http, $stateParams, gameService) {
  console.log($stateParams.gameId);
  $scope.game = gameService.getGame($stateParams.gameId);
})

.controller('ProfileCtrl', function($scope, $http, $stateParams, playerService){
  console.log("wizards");
  console.log($stateParams.profileId);
  playerService.getPlayer().then(function(player){
    $scope.player = player;
  }, function(err){
    console.log(err);
  });
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
    // $scope.access_token = "";
    // console.log("this is pressed");
    // console.log($cordovaFacebook.getLoginStatus());
    // $cordovaFacebook.getLoginStatus().then(function(success){
    //   $scope.access_token = success.authResponse.accessToken;
    //   console.log($scope.access_token);
    //   $http.post("http://localhost:8100/rest-auth/facebook/", {access_token: $scope.access_token}).then(function(success) {
    //     $scope.app_token = success.data.key;
    //     console.log(window.localStorage['app_token']);
    //     window.localStorage['app_token'] = success.data.key;
    //     $http.defaults.headers.common['Authorization'] = "Token " + window.localStorage['app_token'];
    //     console.log("we got code: " + $scope.app_token);
    //     console.log("Success");
    //     $state.go('tab.play');
    //     }, function(error) {
    //       console.log("couldn't get django api key");
    //   });
    // }, function (error) {
      console.log("not already logged in");
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
     // });
   };

  $scope.githubLogin = function () {
    $http.defaults.headers.common['Accept'] = "application/json";
    $http.defaults.headers.common['Content-Type'] = "application/json";
    $cordovaOauth.github('52b484d1831ddde91653', 'c31ded324179feec1eb9425282b342357c3e1f18', ['user']).then(function(success){
      $scope.access_token = success.access_token;
      console.log($scope.access_token);
      $http.defaults.headers.common['Authorization'] = undefined;
      $http.defaults.headers.common['Content-Type'] = 'application/json';
      $http.defaults.headers.common['Accept'] = undefined;
      
      var req = {
       method: 'POST',
       url: 'http://127.0.0.1:8100/rest-auth/github/',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': undefined
       },
       data: { access_token: $scope.access_token }
      }

      $http(req).then(function(success) {
        window.localStorage['app_token'] = success.key;
        console.log(window.localStorage['app_token']);
        $http.defaults.headers.common['Authorization'] = "Token " + window.localStorage['app_token'];
        console.log("Success");
        $state.go('tab.play');
        }, function(error) {
          console.log("couldn't get django api key");
          console.log(error);
      });      
    }, function(err){
      console.log(err);
    });
  };

  $scope.logout = function () {
    $http.post("http://localhost:8100/rest-auth/logout/").then(function(success) {
          $http.defaults.headers.common['Authorization'] = undefined;
          $cordovaFacebook.logout()
            .then(function(success) {
              console.log("logout succesful");
            }, function (error) {
              console.error('ERR', err);
              $state.go('signin');
            });
          $state.go('signin');
        }, function(err) {
          console.error('ERR', err);
          $state.go('signin');
    });
  };
});

