var express = require('express');
var socketIO = require('socket.io');
var fs = require('fs');
var http = require('http');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var path = require('path');
var jade = require('jade');

var app = express();
var server = http.createServer(app);
var client = mysql.createConnection({
	user:'root',
	password:'csda3232',
	database:'company'
});

app.use(bodyParser.urlencoded({
	extended : false
}));
app.use(express.static(path.join(__dirname, 'public')));



var seats = [[1,1,0,1,1,0,0,0,0,1,1,0,1,1],
[1,1,0,1,1,1,1,1,1,1,1,0,1,1],
[1,1,0,1,1,1,1,1,1,1,1,0,1,1],
[1,1,0,1,1,1,1,1,1,1,1,0,1,1],
[1,1,0,1,1,1,1,1,1,1,1,0,1,1],
[1,1,0,1,1,1,1,1,1,1,1,0,1,1],
[1,1,0,1,1,1,1,1,1,1,1,0,1,1],
[1,1,0,1,1,1,1,1,1,1,1,0,1,1],
[1,1,0,1,1,1,1,1,1,1,1,0,1,1],
[1,1,0,1,1,1,1,1,1,1,1,0,1,1],
[1,1,0,1,1,1,1,1,1,1,1,0,1,1],
[1,1,0,1,1,1,1,1,1,1,1,0,1,1]];

app.get('/',function(request,response){
	fs.readFile('movie.html','utf8',function(error,data){
		response.send(data);
	});
});

app.get('/reserve/:id',function(request,response,next){
	var id = request.params.id;
	fs.readFile('reserve.jade','utf8',function(error,data){
		var fn = jade.compile(data);
		response.send(fn({
			name:id
		}));
	});
});


app.get('/seats',function(request,response,next){
	response.send(seats);
});
app.get('/index',function(request,response,next){
	fs.readFile('index.html','utf8',function(error,data){
		response.writeHead(200,{'Content-type':'text/html'});
		response.end(data);
	})
});
app.get('/register',function(request,response,next){
	fs.readFile('register.html','utf8',function(error,data){
		response.writeHead(200,{'Content-type':'text/html'});
		response.end(data);
	})
});
app.get('/member',function(request,response){
	client.query('select * from cgv',function(error,data){
		response.send(data);
	})
})
app.post('/register',function(request,response){
  var body = request.body;
  var id = body.id;
  var password = body.password;
  var name = body.name;
  var birth = body.birth;
  var number = body.number;
  client.query('insert into cgv(id,password,name,birth,phonenumber)value(?,?,?,?,?)',[id,password,name,birth,number],function(){
    response.redirect('/register');
  })
})

server.listen(52273,function(){
	console.log('server is running');
});

var io = socketIO.listen(server);
io.sockets.on('connection',function(socket){
	socket.on('check',function(data){
		var check = seats[data.y][+data.x];
		if(check == 1){
			for(var i=0;i<data.number;i++){
				seats[data.y][+data.x + i] = 2;
			}
			io.sockets.emit('reserve',data);
		}else if(check == 2){
			for(var i=0;i<data.number;i++){
				seats[data.y][+data.x + i] = 1;
			}
			io.sockets.emit('cancel',data);
		}
	});
});