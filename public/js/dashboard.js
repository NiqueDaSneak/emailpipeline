$(document).ready(() => {
  var socket = io.connect()
  // DEFINE SOCKET
  // EMIT SOCKET REQUEST FOR LIST OF EMAILS
  $('form button').click(() => {
    socket.emit('saveAsset', { header: $('.header').val(), subhead: $('.subhead').val(), description: $('.description').val(), link: $('.link').val() })
  })

})
