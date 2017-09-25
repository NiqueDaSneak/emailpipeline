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

  $('.list-of-emails').click('remove-from-list', (event) => {
    socket.emit('followedUp', { email: $(event.target).data('email') })
  })

  socket.emit('requestRecipients')

  socket.on('recipientFollowUpChanged', () => {
    socket.emit('requestRecipients')
  })

  socket.on('sendingRecipients', (data) => {
    $('.list-of-emails').empty()
    for (var i = 0; i < data.data.length; i++) {
      if (data.data[i].followedUp === false) {
        $('.list-of-emails').append("<div><span>"+ data.data[i].email + "</span><span>" + data.data[i].firstName + "</span><span>" + data.data[i].lastName + "</span><button class='remove-from-list' data-email=" + data.data[i].email + " type='button' name='button'>Remove From List</button></div>")
      }
    }
  })

})
