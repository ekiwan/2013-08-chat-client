var getMessages = function(){
    $.ajax('https://api.parse.com/1/classes/messages?order=-createdAt', {
      contentType: 'application/json',
      success: function(data){
        $('#main h2').remove();
        $('#main p').remove();
        for (var i = 0; i < 10; i++){
          if(data.results[i].username === undefined){
            data.results[i].username = "Guest";
          }
          $('#main').append("<h2><a href='#' class='username'></h2>");
          $('#main a:last').text(data.results[i].username);
          $('#main').append("<p class='message'>");
          $('#main p:last').text(data.results[i].text);
          // console.log(data);
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

var sendMessage = function(string){
  var userNameEncode = window.location.search.substr(window.location.search.indexOf("=") + 1);
  var userNameString = decodeURIComponent(userNameEncode);
  $.ajax('https://api.parse.com/1/classes/messages',{
    type: "POST",
    contentType: 'application/json',
    data: JSON.stringify({username: userNameString, text: string})
  });
};

var createUser = function(username, password) {
  $.ajax('https://api.parse.com/1/users',{
    type: "POST",
    contentType: 'application/json',
    data: JSON.stringify({username: username, password: password, friends: {} })
  });
};

var loginUser = function(username, password) {
  $.ajax('https://api.parse.com/1/login?username=' + username + "&password=" + password, {
    type: "GET",
    contentType: 'application/json',
    success: function(data){
      sessionStorage.authToken = data.sessionToken;
      sessionStorage.userId = data.objectId;
      sessionStorage.friends = data.friends;
    }
  });
};


var addFriend = function(friendName) {
  sessionStorage.friends[friendName] = true;
  friends = sessionStorage.friends;
  console.log('https://api.parse.com/1/users/' + sessionStorage.userId);
  $.ajax('https://api.parse.com/1/users/' + sessionStorage.userId, {
    type: "PUT",
    sessionToken: sessionStorage.authToken,
    contentType: 'application/json',
    data: JSON.stringify({friends: friends})
  });
};

$(document).ready(function(){
  $('body').on('click', '.username', function(event){
      event.preventDefault();
      var friendName = $(this).text();
      $(this).css('color', 'green');
      console.log("yes");
      addFriend(friendName);

  });
});



