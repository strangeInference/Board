var Sequelize = require("sequelize");
var db;
if (process.env.PORT) {
  db = new Sequelize("d85rqkr8v6isif", "cyovufgurynjkv", "5Ngw22AyNMlJMGkO2XFqOnt2pG", {
    host: 'ec2-54-225-197-30.compute-1.amazonaws.com',
    dialect: 'postgres'
  });
} else {
  db = new Sequelize("board", "", "", {
    host: 'localhost',
    dialect: 'postgres'
  });
}


// we define the models we need using js--we don't need a schema file!
var User = db.define('User', {
  google_id: Sequelize.STRING,
  google_token: Sequelize.STRING,
  google_name: Sequelize.STRING,
  facebook_id: Sequelize.STRING,
  facebook_token: Sequelize.STRING,
  facebook_name: Sequelize.STRING,
  //BoardId: Sequelize.INTEGER
});

// puts a UserId column on each Message instance
// also gives us the `.setUser` method, available inside the .success callback
// after creating a new instance of Message
// Message.belongsTo(User);
// enables bi-directional associations between Users and Messages
// User.hasMany(Message);

console.log('pre user sync');

// creates these tables in MySQL if they don't already exist. Pass in {force: true}
// to drop any existing user and message tables and make new ones.


var Board = db.define('Board', {
  name: Sequelize.STRING,
  thing: Sequelize.BLOB,
  //UserId: Sequelize.INTEGER
});

User.belongsToMany(Board, { through: 'Users_Boards' } );
Board.belongsToMany(User, { through: 'Users_Boards' } );

User.sync()
  .then(function() {
    console.log('User Table has is definitely in our Postgres Database');
  });

Board.sync()
  .then(function() {
    console.log('Board Table has is definitely in our Postgres Database');
  });

// Board.hasMany(User);
// User.hasMany(Board);
// Users_Boards = db.define('Users_Boards', {
//   board_id,
//   user_id
// });

module.exports = {
  User: User,
  Board: Board
}
