const rooms = []

const addRoom = ( {roomid, users} ) => {
    roomid = roomid
    users = users


    const room ={roomid,users}
    rooms.push(room)
    return {
        rooms
    }
}
 addRoom({
     roomid: 32,
     users: [{id:23, name:'vish'}]
 })
 const getUserInRoom =(name) =>{
    return rooms.filter((room) => room.users.find(user) )
}
const ll = getUserInRoom('vish')
 console.log(ll)