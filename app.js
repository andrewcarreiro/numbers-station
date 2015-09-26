var express = require('express'),
	fs = require('fs'),
	base64 = require('node-base64-image');
var app = express();


// var home = fs.readFileSync('index.html', {encoding:'utf-8'});
// app.get('/', function ( req, res ){ res.send(home); });

app.get('/', function ( req, res ){ res.send(fs.readFileSync('index.html', {encoding:'utf-8'})); });

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
var io = require('socket.io')(server);

io.on('connection', function ( socket ){
	socket.join('numbers');
	socket.join('background');
});



var audio_files = [];
for ( var i=1; i<99; i++ ){
	audio_files.push(fs.readFileSync('audio/'+i+'.mp3'));
}

setInterval( function () {
	var number_choice = Math.floor(Math.random() * 100 ) + 1;
	io.to('numbers').emit ('number', { 
		number : number_choice,
		audio  : audio_files[number_choice - 1]
	});
},5000);


var background;
base64.base64encoder('images/1.png', {localFile: true, string: true}, function ( err, image ){
	background = image;
}); 

setInterval( function () {
	io.to('background').emit('bg-change', { image : background })
},500);