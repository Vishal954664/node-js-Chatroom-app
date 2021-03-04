socket = io()

const $messageForm = document.querySelector('#message-form')

const $messageFormInput = $messageForm.querySelector('input')

const $messageFormButton = $messageForm.querySelector('button')

const $sendLocationButton = document.querySelector('#send-location')

const $messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML   
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
 
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options 

const {username, room } = Qs.parse(location.search,{ ignoreQueryPrefix: true })


socket.on('message',(message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username:message.username,
        message: message.text ,
        createdAt: moment(message.createdAt).format('h:mm  a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage',(message) => {  
    
    console.log(message)
    const html = Mustache.render(locationMessageTemplate,{
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('roomData',({room,users}) => {
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML= html
    console.log(room)
    console.log(users)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')


    const message =e.target.elements.message.value

    socket.emit('sendMessage',message ,(message)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        console.log('The message was delivered!', message)
    })
})

$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by browser')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((postion) => {
        
        socket.emit('sendLocation',{
            latitude: postion.coords.latitude,
            longitude: postion.coords.longitude
        },() => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('location shared!')
        }
        )

    })
})


socket.emit('join',{username, room}, (error) => {
    if(error){
        alert(error)
        location.href ="/"
    }
})

//socket.on('countUpdated', (count) => {
   // console.log('The Count has been Updated',count)
//})

//document.querySelector('#increment').addEventListener('click',() =>{
  //  console.log('Clicked')
  //  socket.emit('increment')
//})