var http = require('http');
var express = require('express');
var socketIO = require('socket.io');
var fs = require('fs');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
var server = http.createServer(app);
var client = mysql.createConnection({
	user:'root',
	password:'csda3232',
	database:'location'
});
var dummyId;

app.use(bodyParser.urlencoded({
	extended:false
}));
app.use(express.static(__dirname + '/public'));

app.get('/',function(request,response){
	fs.readFile('login.html', function(error,data){
		response.writeHead(200,{'Content-type':'text/html'})
		response.end(data);
	});
});
app.post('/',function(request,response){
	dummyId = request.body.id;
});
app.get('/id',function(request,response){
	client.query('select * from locations where name=?',[dummyId],function(error,data){
		response.send(data);
	});
})

app.get('/register',function(request,response){
	fs.readFile('register.html', function(error,data){
		response.writeHead(200,{'Content-type':'text/html'})
		response.end(data);
	});
});
app.post('/register',function(request,response){
	var body = request.body;
	client.query('insert into register (name,password )VALUE(?,?)',[body.id,body.password],function(error,data){
		response.redirect('/');
	});
});

app.get('/tracker',function(request,response){
	fs.readFile('newTracker.html', function(error,data){
		response.writeHead(200,{'Content-type':'text/html'})
		response.end(data);
	});
});
app.get('/showdata',function(request,response){
	client.query('select * from locations where name=?',[request.query.name],function(error,data){
		response.send(data);
	});
});
app.get('/check',function(request,response){
	client.query('select * from register where name=?',[request.query.name],function(error,data){
		response.send(data);
	})
});

server.listen(52273,function(){
	console.log('server is running');
});

var io = socketIO.listen(server);
io.sockets.on('connection',function(socket){
	socket.on('join',function(data){
		socket.join(data);
	});
	socket.on('location',function(data){
		client.query('INSERT INTO locations(name,latitude,longitude,date) VALUES (?,?,?,NOW())',[data.name,data.latitude,data.longitude]);

		io.sockets.in(data.name).emit('receive',{
			latitude:data.latitude,
			longitude:data.longitude,
			date:Date.now()
		});
	});
	socket.emit('insertId',dummyId);
});

