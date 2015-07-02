 angular.module('starter.controllers', [])


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.backButton.text('');

})

.controller('MainCtrl', function($scope, $ionicHistory) {
  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
})

.controller('DashCtrl', function($scope, Notes, Users, $ionicPlatform, $cordovaClipboard) {

  $scope.note = {};

  // check user and create if not exists in firebase
  var user = Users.getUser();

  var getNotes = function() {
    Notes.getAll().then(function(notes) {
      $scope.items = notes;  
    });
  };

  $scope.addItem = function() {
    if ($scope.note.description) {
      Notes.insert($scope.note).then(function() {
        $scope.note = {};
        getNotes();
      })
    }
  };

  $scope.copyNote = function(note) {
    $ionicPlatform.ready(function(){

      // isWebView such as Cordova Platform
      if(ionic.Platform.isWebView()){
        $cordovaClipboard.copy(note)
        .then(function () {
          // success
          console.log('copied');
          $scope.lock = note;
        }, function () {
          // error
          console.log('not');
          $scope.lock = 'erro';
        });
      } else {
        alert('web');
        $scope.lock = 'como web';
      }
    });

  };

  getNotes();

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('FacebookCtrl', function() {
});
