const path = require('path');

// ============ Express ============ 
const express = require('express');
const app = express();

// ============ Static Routes ============ 
app.use(express.static( path.join(__dirname, "static") ));

// ============ Server ============ 
const server = app.listen(5000);

// ============ Sockets ============ 
const io = require('socket.io')(server);

var user_list = [ /* {  }*/ ]; // { socket_id: 13, user_name: 'Tina'}
var user_count = 0;
var message_list = [];

io.on('connection', function(socket){

    socket.emit('message_history', {message_list: message_list});

    socket.on('new_user', function(user){
        console.log('Socket ID', socket.id);
        console.log('new_user invoked by client - user:', user);
        const userObject = {
            socket_id: socket.id,
            user_name: user.name
        }
        console.log(userObject);
        user_list.push(userObject);
        user_count = user_list.length;
        console.log(user_list);
        io.emit('update_user_list', {user_list: user_list})
    })

    socket.on('new_message', function(data){
        console.log(socket.id);
        console.log(data.msg);
        for(var idx=0; idx<user_list.length; idx++){
            if(user_list[idx].socket_id == socket.id){
                user_name = user_list[idx].user_name;
                msg = data.msg;
                messageObject = { user_name: user_name, msg: msg }
                message_list.push(messageObject);
                break;
            }
        }
        io.emit('receive_message', messageObject);
    })

})

