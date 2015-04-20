angular.module('starter.services', [])
.factory('gameService', function($http) {

  var games = [];
  var hosted_games = [];
  var joined_games = [];

  return {
    getGames: function(){
      return $http.get("http://localhost:8100/games/").then(function(success) {
        games = success.data;
        return games;
      });
    },
    getGame: function(id){
      for(i=0;i<games.length;i++){
        if(games[i].id == id){
          return games[i];
        }
      }
      return null;
    }
    // getHostedGames: function(){
    //   return $http.get("http://localhost:8100/games/", {type: "hosted"}).then(function(success) {
    //     hosted_games = success.data;
    //     console.log(hosted_games);
    //     return hosted_games;
    //   });
    // },
    // getJoinedGames: function(){
    //   return $http.get("http://localhost:8100/games/", {type: "joined"})
    //     joined_games = success.data;
    //     console.log(joined_games);
    //     return joined_games;
    //   });
    // }
  }
})

// .factory('profileService', function($http) {
//   return {
//     getProfile: function(){
//       return $http.get("http://localhost:8100/users/6/").then(function(success) {
//         player = success.data;
//         return player;
//       });
//     }
//   }
// })

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
