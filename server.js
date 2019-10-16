var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var Message = mongoose.model('Message', {
	name: String,
	message: String
});
//Connect account password to the DATABASE so the chat will be on fire !!!
var dbUrl = 'mongodb://jphayek:Jp462017@ds257981.mlab.com:57981/chat-node-js';
mongoose.connect(dbUrl, (err) => {
	console.log('mongodb connected', err);
});

var Message = mongoose.model('Message', { name: String, message: String });
app.get('/messages', (req, res) => {
	Message.find({}, (err, messages) => {
		res.send(messages);
	});
});

app.get('/messages/:user', (req, res) => {
	var user = req.params.user;
	Message.find({ name: user }, (err, messages) => {
		res.send(messages);
	});
});

app.post('/messages', async (req, res) => {
	try {
		var message = new Message(req.body);

		var savedMessage = await message.save();
		console.log('saved');

		var censored = await Message.findOne({ message: 'badword' });
		if (censored) await Message.remove({ _id: censored.id });
		else io.emit('message', req.body);
		res.sendStatus(200);
	} catch (error) {
		res.sendStatus(500);
		return console.log('error', error);
	} finally {
		console.log('Message Posted');
	}
});

io.on('connection', () => {
	console.log('a user is connected');
});

mongoose.connect(dbUrl, { useMongoClient: true }, (err) => {
	console.log('mongodb connected', err);
});

var server = http.listen(3000, () => {
	console.log('server is running on port', server.address().port);
});
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// so i can get the messages
app.get('/messages', (req, res) => {
	Message.find({}, (err, messages) => {
		res.send(messages);
	});
});
// so i can post this messages
app.post('/messages', (req, res) => {
	var message = new Message(req.body);
	message.save((err) => {
		if (err) sendStatus(500);
		res.sendStatus(200);
	});
});
