var socket = io()

// Elements
var $messageForm = document.querySelector('#Message-form')
var $messageFormInput = $messageForm.querySelector('input')
var $messageFromButton = $messageForm.querySelector('button')
var $sendlocationButton = document.querySelector('#send-location')
var $messages = document.querySelector('#messages')


// Templates
var messageTemplate = document.querySelector('#message-template').innerHTML
var locationTemplate = document.querySelector('#location-template').innerHTML
var sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options

var {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true})

var autoscroll = ()=>{

    // New Message Element
    var $newMessage = $messages.lastElementChild

    // Height of new message
    var newMessageStyle = getComputedStyle($newMessage)
    var newMessageMargin = parseInt(newMessageStyle.marginBottom)
    var newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    console.log(newMessageMargin)

    //Visible Height

    var visibleHeight = $messages.scrollHeight

    //Height of message container

    var containerHeight = $messages.scrollHeight

    //how far I have scrolled?

    var scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
} 

socket.on('message',(message)=>{
    console.log(message)  
    var html = Mustache.render(messageTemplate, {
        username:message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})



socket.on('roomData',({ room, users })=>{
    var html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

socket.on('locationMessage', (message)=>{
    console.log(message)
    var html = Mustache.render(locationTemplate,{
        username:message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()

})

$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    $messageFromButton.setAttribute('disabled', 'disabled')
    var message = document.querySelector('input').value
    socket.emit('sendMessage', message, (error) =>{
        $messageFromButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('Message is delivered')
        
        //console.log('Message is delivered', error){}
    })

    //var message = e.target.elements.message.value
})

$sendlocationButton.addEventListener('click',()=>{

    if(!navigator.geolocation){
        return alert('Your browser is not suppoted the geolocation')
    }

    $sendlocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position)=>{

        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },()=>{
            $sendlocationButton.removeAttribute('disabled')
            console.log('Location is send')
        })
        

        //console.log(position)
    })
})

/*socket.on('countUpdated', (count)=>{
    console.log('Count is updated', count)
})

document.querySelector('#increment').addEventListener('click', ()=>{
    console.log('clicked')
    socket.emit('increment')
})*/

socket.emit('join', { username, room },(error)=>{
      if(error){
          alert(error)
          location.href = '/'
      }
})