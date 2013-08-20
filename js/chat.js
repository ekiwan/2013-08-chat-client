var getMessages = function(roomName){
    roomName = roomName || 'messages';
    $.ajax('https://api.parse.com/1/classes/' + roomName + '?order=-createdAt', {
      contentType: 'application/json',
      success: function(data){
        $('#main h2').remove();
        $('#main p').remove();
        for (var i = 0; i < 10; i++){
          if(data.results[i].username === undefined && data.results[i] !== sessionStorage.username){
            data.results[i].username = "Guest";
          }
          if(sessionStorage[data.results[i].username] === "true"){
            $('#main').append("<h2 class='friend'><a href='#' class='username'></h2>");
          } else {
            $('#main').append("<h2><a href='#' class='username'></h2>");
          }
          $('#main a:last').text(data.results[i].username);
          $('#main').append("<p class='message'>");
          $('#main p:last').text(data.results[i].text);

        }
      },
      error: function(data) {
        console.log('Ajax request failed');
      }
    });
};

var refreshMessages = function(){
  setInterval(function(){
    getMessages();
  }, 5000);
};

var sendMessage = function(string, roomName){
  // var userNameEncode = window.location.search.substr(window.location.search.indexOf("=") + 1);
  // var userNameString = decodeURIComponent(userNameEncode);
  var userNameString = sessionStorage.username;
  var currentRoom = roomName || "messages";
  $.ajax('https://api.parse.com/1/classes/' + currentRoom,{
    type: "POST",
    contentType: 'application/json',
    data: JSON.stringify({username: userNameString, text: string})
  });
};

var createUser = function(username, password) {
  $.ajax('https://api.parse.com/1/users',{
    type: "POST",
    contentType: 'application/json',
    data: JSON.stringify({username: username, password: password, friendList: {} })
  });
};

var loginUser = function(username, password) {
  $.ajax('https://api.parse.com/1/login?username=' + username + "&password=" + password, {
    type: "GET",
    contentType: 'application/json',
    success: function(data){
      for(var key in data.friendList){
        // var sessionFriends = jQuery.parseJSON(sessionStorage);
        sessionStorage[key] = true;
      }
      sessionStorage.authToken = data.sessionToken;
      sessionStorage.userId = data.objectId;
      sessionStorage.username = data.username;
    }
  });
};


var addFriend = function(friendName) {
  sessionStorage.setItem(friendName, true);
  friends = sessionStorage;
  console.log('https://api.parse.com/1/users/' + sessionStorage.userId);
  $.ajax('https://api.parse.com/1/users/' + sessionStorage.userId, {
    type: "PUT",
    contentType: 'application/json',
    data: JSON.stringify({friendList: friends})
  });
};

$(document).ready(function(){
  $('body').on('click', '.username', function(event){
      event.preventDefault();
      var friendName = $(this).text();
      console.log(friendName);
      $(this).css('color', 'green');
      console.log("yes");
      addFriend(friendName);

  });
});

setInterval(function(){
  var colorArray = [0,1,2,3,4,5,6,7,8,9, "a", "b", "c", "d", "e", "f"];
  var getRandomColor = function(colorArray){return colorArray[Math.floor(Math.random()*colorArray.length)]; };
  var randomColors = "#" + getRandomColor(colorArray) + getRandomColor(colorArray) + getRandomColor(colorArray) + getRandomColor(colorArray) + getRandomColor(colorArray) + getRandomColor(colorArray);

  $('.friend').css('background-color', randomColors);
}, 1000);



