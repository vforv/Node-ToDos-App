var Sequelize = require("sequelize");

var sequelize = new Sequelize('todonode', 'root', 'sifra15', {
    host: "localhost",
    dialect: "mysql",
    logging: function () {},
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    dialectOptions: {
        socketPath: "/var/run/mysql/mysql.sock"
    },
    define: {
        paranoid: true
    }
});

var db = {};

db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;