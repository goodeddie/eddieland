var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); // Force xhr-polling on AppFog
  //io.set("polling duration", 10);
});
app.use('/', express.static(__dirname + '/')); // Include every javascript file
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
//server.listen(80);
server.listen(4000); // Local testing



var nUsers = 0; // Current number of users
var hUsers = 0; // Highest number of users
var userDataList = new Array();

io.sockets.on('connection', function (socket) {
	nUsers++;
	hUsers++;
  io.sockets.emit('user connected', {nUsers: nUsers, hUsers: hUsers});
	console.log('Player connected server.');

	socket.on('add player', function (data) {
		console.log(data.x);
		userDataList.push([hUsers + 1, data]);
		socket.broadcast.emit('update players', userDataList);
	});
	
  socket.on('update chatbox', function (text) {
		io.sockets.emit('update chatbox', text);
	});

  socket.on('disconnect', function () {
		nUsers--;
    io.sockets.emit('user disconnected', nUsers);
		
		console.log('Player disconnected server.');
  });
});