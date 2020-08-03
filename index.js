const express= require('express');
const socketio= require('socket.io');
const cors= require('cors');
const http= require('http');

// requiring all the user functionality
const {addUser,removeUser, getUser, getUsersInRoom}= require('./users');

// either run on socket.io port OR localhost:5000
const PORT= process.env.PORT || 5000;

// requiring the router
const router= require('./router');

const app= express();
const server= http.createServer(app);
const io= socketio(server);

// middleware
app.use(router);    // everything will be send through the router
app.use(cors());



// handling client side connection/disconnection
io.on('connection', (socket) => {
    // SPECIFYING SOCKET EVENTS FOR CLIENT SIDE
    // same exact string i.e. join
    socket.on('join', (props, CallBack) => {
        // DESTRUCTURED SYNTAX like data.error, data.user
        const { error, user}= addUser({             // error i.e. dynamically coming from the addUser()
            id: socket.id,
            name: props.name,
            room: props.room
        });

        // ERROR HANDLING
        if(error){
            return CallBack(error);
        }

        // Emitting an event on behalf of the admin
        socket.emit('message', {user: 'admin', text: `${user.name}, Welocme boii..`});      // this is for that particular user
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name} tasreef la rahe hai...`});
        // broadcast will be to(..) except that particular user


        // and then joinning the new user to the room 
        socket.join(user.room);      // socket inbuild function to join the speciified here its room

        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})

        CallBack();     // for the front-end (chat.js), passing nothing if no error 
    });



    // for user generated message
    socket.on('sendMessage', (message, CallBack) => {
        // getting user who sent the message
        const user= getUser(socket.id);

        // 
        io.to(user.room).emit('message', { user: user.name, text: message});
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});

        // for front-end use
        CallBack();
    });

    

    // must be inside the io so that to disconnect that particular socket if disconnected
    socket.on('disconnect', () => {
        const user= removeUser(socket.id);

        if(user){
            io.to(user.room).emit('message', { user: 'admin', text:`${user.name} chlaa gyaa bois.. :-{`});
        }
    })
});

server.listen(PORT, () => console.log(`server has started on port: ${PORT}`) );
