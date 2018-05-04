var socket = io();

function scrollToBottom () {
  //selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  //Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();
  // console.log("clientHeight: ",clientHeight);
  // console.log("scrollTop: ",scrollTop);
  // console.log("scrollHeight: ",scrollHeight);
  // console.log("newMessageHeight: ",newMessageHeight);
  // console.log("lastMessageHeight: ",lastMessageHeight);
  // if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
  //   messages.scrollTop(scrollHeight);
  //  }
    //56.44 is the height of the input bar
    if(scrollHeight >= scrollTop + clientHeight){
        messages.scrollTop(56.44 + scrollHeight + lastMessageHeight);
    }
}

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function (e){
  e.preventDefault();
  // console.log("1");
  // console.log(Date.now());

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function (){
    // console.log("2");
    // console.log(Date.now());

      messageTextbox.val('')
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function (){
  if (!navigator.geolocation){
    return alert('Geolocation not supported by your browser.');
  }
  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position){
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
