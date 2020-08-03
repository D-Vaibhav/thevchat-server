const users= [];

// simply destructuring the props 
const addUser= ({id, name, room})=> {
    name= name.trim().toLowerCase();
    room= room.trim().toLowerCase();

    // checking whether user already taken
    const existingUser= users.find( user => user.name ===name && user.room === room);
    if(existingUser){
        return { error: 'Username already taken'};
    }

    const user= {
        id,
        name,
        room
    };
    users.push(user);       // pushing user object to the user list
    return {user};
}

const removeUser= (id)=> {
    // finding the user
    const index= user.findIndex( user=> user.id === id);

    // removing the user
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

const getUser= (id)=> (users.find( user => user.id === id));

const getUsersInRoom= (room)=> users.filter( user => user.room === room);

module.exports= {addUser,removeUser, getUser, getUsersInRoom};