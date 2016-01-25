var express  = require('express');
var app      = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mysql      = require('mysql');
var server = app.listen(8080);
var io = require('socket.io').listen(server);
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'molboard'
});

connection.connect(function(err) {
  // connected! (unless `err` is set)
  if(err){
    console.log(err)
  } else {
    console.log('success');
  }
});



app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
//////////////////////////

//serve up static index.js file
app.get('/', function(req, res){
  res.sendFile('/index.html');
});

//add a user to the database
app.post('/users', function(req, res){
  connection.query('INSERT INTO users VALUES ('+req.body.PersonID+', "'+req.body.LastName+'", "'+req.body.FirstName+'", "'+req.body.Address+'", "'+req.body.City+'") ');
  res.send('done');
});

//get all users
app.get('/users', function(req, res) {
  connection.query('SELECT * from users', function (err, rows, fields) {
   if (!err){
     res.send('rows: ', rows);
   }
   else {
     res.send('Error while performing Query.');
   }
  });
});

//get a specific user
app.get('/users/:Last', function (req, res){
  connection.query('SELECT * from users WHERE LastName="'+req.params.Last+'" ', function(err, rows, fields) {
   if (err){
     res.send('Error while performing Query.');
   }
   res.send(rows);
  });
});

//get all boards
app.get('/boards', function (req, res) {
  connection.query('SELECT * from boards', function(err, rows, fields) {
    if(err){
      res.send('error while performing Query');
    };
    //we are hardcoding in number in the row[number]. This should be changed to whatever the current board to be gotten is.
    res.send(rows[2].thing);
  });
});

//create a board
app.post('/boards', function (req, res) {
  console.log('params = ',req.params);
  console.log('body = ', req.body[1]);
  connection.query('INSERT INTO boards VALUES("'+req.body[0]+'")', function(err, rows, fields){
    if(err){
      console.log('error: ', err);
      res.send(err);
    }
    res.send(rows);
  });
});

//***************************************************
// *SOCKETS*
//***************************************************
io.on('connection', function (socket) {

  socket.on('create board', function (boardName) {
    socket.join(boardName);
    socket.room = boardName;
  });

  socket.on('join board', function (boardName) {
  });

  socket.on('draw', function (data) {
    io.to(socket.room).emit('draw', data);
  });
});


// listen (start app with node index.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");
