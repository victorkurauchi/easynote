angular.module('starter.services', [])

.factory('Users', function($firebaseArray, $firebaseObject) {
  var ref = new Firebase("https://luminous-fire-50.firebaseio.com/users");
  var list = $firebaseArray(ref);

  var currentUser = null;

  var getUser = function() {

    var self = this;

    if (localStorage.getItem('_firebaseUserId')) {
      self.currentUser = localStorage.getItem('_firebaseUserId');
      return localStorage.getItem('_firebaseUserId');
    } else {
      var uid = Math.round(Math.random() * (99999999999 - 1) + 1);
      var hash = CryptoJS.MD5(uid.toString());
      hash = hash.toString();

      list.$loaded()
      .then(function(users) {

        console.log(users);

        var obj = {
          name: 'Anonymous',
          createdon: new Date(),
          email: 'admin@gmail.com',
          id: hash
        };

        return users.$add(obj)
        .then(function(result) {
          localStorage.setItem('_firebaseUserId', obj.id);
          self.currentUser = obj.id;
          return obj.id;
        });
        
      })
    }

  };

  var getAll = function() {
    return $firebaseArray(ref);
  };

  var findByKey = function(key) {
    return $firebaseArray(ref).$getRecord(key);
  };

  return {
    getAll: getAll,
    findByKey: findByKey,
    getUser: getUser,
    currentUser: currentUser
  };
})


.factory('Notes', function($firebaseArray, $firebaseObject, Users) {  
  var ref = new Firebase("https://luminous-fire-50.firebaseio.com/notes");

  var getAll = function() {
    var user = Users.getUser();
    var list = $firebaseArray(ref);
    var userNotes = [];

    return list.$loaded()
    .then(function(notes) {
      
      userNotes = notes.filter(function(item) {
        return item.userid === user;
      });

      console.log(userNotes);

      return userNotes;

    });

  };

  var insert = function(note) {
  
    var user = Users.getUser();
    var list = $firebaseArray(ref);

    return list.$loaded().then(function(result) {
      return result.$add({
        "title": note.title || '',
        "description": note.description,
        "createdon": new Date().toString(),
        "userid": user
      });
    });
  };

  var findByKey = function(key) {
    return $firebaseArray(ref).$getRecord(key);
  };

  return {
    getAll: getAll,
    findByKey: findByKey,
    insert: insert
  };

})

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
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
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
