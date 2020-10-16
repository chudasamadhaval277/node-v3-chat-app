var users = []

var addUser = ({ id, username, room })=>{

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()


    // Validate the data

    if(!username || !room){
        return{
            error: 'Username and Room are required'
        }
    }

    // check for existing user
    var existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })


    // Validate username

    if(existingUser){
        return{
            error: 'username is in use'
        }
    }

    // store user
    var user = {id, username, room}
    users.push(user)
    return { user }

} 

var removeUser = (id)=>{

    var index = users.findIndex((user) => user.id === id)

    if(index !== -1){
        return users.splice(index ,1)[0]
    }
}
var getUser = (id)=>{
    return users.find((user)=> user.id === id)
}
var getUserInRoom = (room)=>{
    //room = room.trim().toLowerCase()
    return users.filter((user)=> user.room === room)
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}






















addUser({
    id: 25,
    username: 'Dhaval',
    room: 'Dhaval Chudasama'
})
addUser({
    id: 26,
    username: 'Suhani',
    room: 'Dhaval Chudasama'
})
addUser({
    id:28,
    username:'Ankit',
    room:'Ankit'
})

//console.log(users)

var user = getUser(28)
console.log(user)

var userroom = getUserInRoom('dhaval chudasama')
console.log(userroom)



/*var res = addUser({
    id: 26,
    username: 'Dhaval',
    room: 'Dhaval Chudasama1'
})*/

//console.log(res)

/*var removeUser = removeUser(25)
console.log(removeUser)
console.log(users)*/