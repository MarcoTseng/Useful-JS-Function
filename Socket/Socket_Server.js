function Socket_Server(binding) {

    try {
        // initial the io server
        this.io = require('socket.io')(binding);

        // current connected user list
        this.Current_User_List = {};
        
        this.SocketID_UserID_Mapping = new Map();

        var Current_User_List = this.Current_User_List;

        var SocketID_UserID_Mapping = this.SocketID_UserID_Mapping;

        // handle connection
        this.io.on('connection', function(socket){

            // Welcome Message
            socket.emit('Initial_data_request', 'Request');

            // User Register
            socket.on('Initial_data_request', function(msg) {
                
                if(Current_User_List.hasOwnProperty(msg.id))
                {
                    socket.emit('Initial_data_request', 'Retry - Duplicate User');
                }
                else
                {
                    Current_User_List[msg.id] = {
                        name : msg.id,
                        socket_id : socket.id,
                        extend : msg.extend,
                        room_id : ""
                    };

                    SocketID_UserID_Mapping.set(socket.id,msg.id);

                    socket.emit('Initial_data_request', 'Confirm');

                    //console.log("Connected : " + msg.id);
                }
            });

            // Conversation Handle
            socket.on('Conversation', function(msg) {
                
                // Check the confirm
                if(SocketID_UserID_Mapping.has(socket.id))
                {
                    // Avoid sending msg to itself
                    if(SocketID_UserID_Mapping.get(socket.id) == msg.to_id)
                        return;

                    if(msg.type === "Handshake")
                    {
                        // Check user status
                        socket.emit('Conversation', {
                            type : "Handshake",
                            from_id : msg.to_id,
                            message : Current_User_List.hasOwnProperty(msg.to_id) ? "Online" : "Offline" 
                        });

                    }
                    else if(msg.type === "Chat")
                    {
                        if(!Current_User_List.hasOwnProperty(msg.to_id))
                        {
                            // offline message
                            socket.emit('Conversation', {
                                type : "Handshake",
                                from_id : msg.to_id,
                                message : "Offline"
                            });
                        }
                        else
                        {
                            // forward the message
                            socket.to(Current_User_List[msg.to_id].socket_id).emit('Conversation', {
                                type : "Chat",
                                from_id : SocketID_UserID_Mapping.get(socket.id),
                                message : msg.message
                            });
                        }
                    }
                    else if(msg.type === "Typing")
                    {
                        if(Current_User_List.hasOwnProperty(msg.to_id))
                        {
                            // forward typing signal
                            socket.to(Current_User_List[msg.to_id].socket_id).emit('Conversation', {
                                type : "Typing",
                                from_id : SocketID_UserID_Mapping.get(socket.id),
                                message : ""
                            });
                        }
                    }
                    else if(msg.type === "Users")
                    {
                        var user_list = [];

                        for(var key in Current_User_List)
                        {
                            var temp_element = {
                                user : Current_User_List[key].name,
                                data : Current_User_List[key].extend
                            };

                            user_list.push(temp_element);

                        }

                        // Check user status
                        socket.emit('Conversation', {
                            type : "Users",
                            from_id : "",
                            message : "",
                            users :  user_list
                        });
                    }
                    else if(msg.type === "Broadcast")
                    {
                        socket.broadcast.emit('Conversation', {
                            type : "Chat",
                            from_id : SocketID_UserID_Mapping.get(socket.id),
                            message : msg.message
                        });
                    }
                }
                else
                    socket.emit('Initial_data_request', 'Retry - Not Exists User');

            });

            // Handle disconnection
            socket.on('disconnect', function(){
                
                // Clear the data in User and Mapping List
                if(SocketID_UserID_Mapping.has(socket.id))
                {
                    socket.broadcast.emit('Conversation', {
                        type : "Handshake",
                        from_id : SocketID_UserID_Mapping.get(socket.id),
                        message : "Offline" 
                    });

                    delete Current_User_List[SocketID_UserID_Mapping.get(socket.id)];
                    
                    SocketID_UserID_Mapping.delete(socket.id);
                }
            });

        });

    } catch (error) {
        
        throw new Error("Fail to initial the Server !"); 
    }

}

module.exports = Socket_Server;
