$(document).ready(() => {

  // DEFINE SOCKET
  var socket = io.connect()

  // EMIT SOCKET REQUEST FOR LIST OF EMAILS
  $('form button').click(() => {
    socket.emit('saveAsset', { header: $('.header').val(), subhead: $('.subhead').val(), description: $('.description').val(), link: $('.link').val() })
    // reset form
    $('input').val('')
    $('textarea').val('')
  })

  socket.emit('requestRecipients')

  socket.on('sendingRecipients', (data) => {
    for (var i = 0; i < data.data.length; i++) {
      // data.data[i]
      $('.list-of-emails').append("<div><span>"+ data.data[i].email + "</span><span>" + data.data[i].firstName + "</span><span>" + data.data[i].lastName + "</span><button type='button' name='button'>Remove From List</button></div>")
    }
  })

})
