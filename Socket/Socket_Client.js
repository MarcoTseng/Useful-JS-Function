
function Socket_Client(id,option,extend,callback) {
    
    try {
    
        // Check all argument
        if(typeof id != "string" || typeof option != "object" || typeof extend != "object")
            throw new Error("Fail to process the input !");

        // Add port control
        this.io = require("socket.io-client");

        this.socket = this.io.connect(option.url ? option.url : 'http://localhost',{transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling']});

        this.id = id;

        this.typing_timer = {};

        var socket = this.socket;

        var typing_timer = this.typing_timer;

        // Wait for Register Process
        socket.on('Initial_data_request', function(msg) {

            if(msg === 'Request' || msg === 'Retry - Not Exists User')
            {
            var Register_data = {
                id : id,
                extend : extend
            };

            socket.emit('Initial_data_request', Register_data);
            }
            else if(msg === 'Retry - Duplicate User')
            {
            // Change ID and Try Again
            var Register_data = {
                id : id,
                extend : extend
            };

            socket.emit('Initial_data_request', Register_data);
            }
            else if(msg === 'Confirm')
            {
            callback({type:"Initial", from_id : "system", message: id + " is Registered."});
            
            // Complete Register Process and Enable the typing
            socket.on('Conversation', function(receiving_obj) {
                
                callback(receiving_obj);

            });

            }

        });

    } catch (error) {
        
        throw new Error("Fail to initial the Client !");

    }

}

/* Check the User status */
Socket_Client.prototype.Handshake = function(to_id) {

    var Sending_Object = {
        type : "Handshake",
		to_id : to_id,
		message : ""
    }

    this.socket.emit('Conversation', Sending_Object);
}

/* Sending Message to the User */
Socket_Client.prototype.Chat = function(to_id,message) {

    var Sending_Object = {
        type : "Chat",
        to_id : to_id,
        message : message
    };

    this.socket.emit('Conversation', Sending_Object);
}

/* Broadcast Message to All User */
Socket_Client.prototype.Broadcast = function(message) {

    var Sending_Object = {
        type : "Broadcast",
        to_id : "",
        message : message
    };

    this.socket.emit('Conversation', Sending_Object);
}

/* Sending Typing signal to the User */
Socket_Client.prototype.Typing = function(to_id,message) {

    var Sending_Object = {
        type : "Typing",
        to_id : to_id,
        message : message
    };

    this.socket.emit('Conversation', Sending_Object);
}

/* Get all the online User */
Socket_Client.prototype.Users = function() {

    var Sending_Object = {
        type : "Users",
        to_id : "",
        message : ""
    };

    this.socket.emit('Conversation', Sending_Object);
}

/* Disconnect the connection */
Socket_Client.prototype.Disconnect = function() {

    this.socket.disconnect();
}

module.exports = Socket_Client;