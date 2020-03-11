# Useful-JS-Function

This is a simple library contain different kind of useful function.

## Install

```
npm install --save useful-js-ibrary
```

## TIME API
### .get_timezones()
  Returns a array of all the timezones.

**Example**

```javascript
const Times = require('useful-js-ibrary').Times;

const timezones = Times.get_timezones();

```

### .current_location_time(type,option,timezone_name)
  Returns a string base on the parameter.

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| type | string | **require** | time / date / full |
| optoin | object | **require** | addition condition to render date string |
| timezone_name | string | **require** | "" or timezone from .get_timezones() |

#### optoin parameter
| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| time_format | string | "24" | "12" / "24" |
| separators | string | "/" | any string to sperate the date ex. 02/25/2020 with "/" |
| order | array | ["mm","dd","yyyy"] | date string order included "m", "mm", "mmm", "d", "dd", "yy","yyyy"|

**Example**

```javascript
const Times = require('useful-js-ibrary').Times;

const timezones = Times.current_location_time("full",{time_format:"12",separators:"/",order:["mmm","dd","yyyy"]},"Asia/Taipei");

// output => 'Feb/29/2020 07:21:21 AM'

```

## Chat Room function
### Server
  Bind the express server or port number on the Socket.

**Example**

```javascript
var app = require('express')();

var http = require('http').createServer(app);

var Socket_Server = require('useful-js-ibrary').Socket_Server;

var Server = new Socket_Server(http);

```

### Client
  Initial the Client with register ID, option, extend data, callback function
  
#### Initial parameter
| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| id | string | **require** | register ID in your local system. |
| optoin | object | **require** | option for setting socket. |
| optoin.url | string | ------- | IP address sockect binding to. |
| extend | object | **require** | extend data field with user. |
| callback | function | **require** | callback function when the client receiving message. |

**Socket Flow**

1. Connect to the Server and Complete the initial process.

```javascript
var Socket_Client = require('useful-js-ibrary').Socket_Client;

var Socket = new Socket_Client('developer_id',{url:'http://localhost'},{},(msg) => {console.log(msg)});

/* => registered message
{
    type : 'Initial',
    from_id : 'system',
    message : 'developer_id is Registered'
}
*/
```

2. After receiving registered message, start to handle four types of message.

   - Handshake : Comfirm the user Status.
   - Chat : Sending Message to the user.
   - Typing : Sending typing message signal to the user.
   - Users : Get all the current online users.

##### Sending

```javascript

// Handshake
Socket.Handshake('user_id');

// Chat
Socket.Chat('user_id','Hello World');

// Typing
Socket.Typing('user_id','user is typing');

// Users
Socket.Users();

// Broadcast
Socket.Broadcast('Hello World');

// Disconnect
Socket.Disconnect();

```
##### Receiving

###### Message received will forward to callback function.

| Attribute | Type | Value |
| --------- | ---- | ----------- |
| type | string | Handshake / Chat / Typing / Users |
| from_id | string | The id it send from. (Empty when calling Users) |
| message | string | Handshake : Online / Offline. |
| ------- | ------ | Chat : Message from the user. |
| ------- | ------ | Typing : Empty. |
| ------- | ------ | Users :  Empty. |
| users | array | retrun array of users (Users only) |

