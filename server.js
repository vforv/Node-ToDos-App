var express = require("express");
var bodyParser = require("body-parser");
var db = require('./db.js');
var middleware = require('./middleware.js')(db);
var app = express();
var _ = require("underscore");
var PORT = process.env.PORT || 3000;
var bcrypt = require('bcrypt');


app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send("Hello Wrold");
});
//GET /todos?status=true
app.get('/todos',middleware.requireAuth ,function (req, res) {

    var queryParams = req.query;
    var where = {};


    if (queryParams.hasOwnProperty('status') && queryParams.status === 'true') {
        where.status = true;
    } else if (queryParams.hasOwnProperty('status') && queryParams.status === 'false') {
        where.status = false;
    }

    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
        where.description = {
            $like: '%' + queryParams.q + '%'
        };
    }

    db.todo.findAll({
        where: where
    })
            .then(function (todos) {
                res.json(todos);
            })
            .catch(function (e) {
                res.status(500).send();
            });

//        filtredTodos = _.where(filtredTodos, {status: false});

//
//    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
//        filtredTodos = _.filter(filtredTodos, function (todo) {
//            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
//        });
//    }
//
});

//GET /todos/:id
app.get('/todos/:id',middleware.requireAuth , function (req, res) {

    db.todo.findById(req.params.id)
            .then(function (todo) {
                if (!!todo) {
                    res.json(todo.toJSON());
                } else {
                    res.status(404).send();
                }
            })
            .catch(function (e) {
                res.status(500).send();
            });
//    var stringRet = _.findWhere(todos, {id: parseInt(req.params.id)});
});

//POST /todos
app.post('/todos',middleware.requireAuth , function (req, res) {
    var body = _.pick(req.body, 'description', 'status');
    db.todo.create(body)
            .then(function (todo) {
                req.user.addTodo(todo)
                .then(function() {
                    return todo.reload();
                }).then(function(todo){
                    res.json(todo.toJSON());
                });
            })
            .catch(function (e) {
                res.status(400).json(e);
            });
});

// DELETE /todos
app.delete('/todos/:id',middleware.requireAuth , function (req, res) {
    db.todo.destroy({
        where: {
            id: req.params.id
        }
    }).then(function (rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'No todo with id'
            });
        } else {
            res.status(204).send();
        }
    })
            .catch(function (e) {
                res.status(500).send();
            });
//    todos = _.without(todos, matchItem);
});

//PUT /todos/:id
app.put('/todos/:id',middleware.requireAuth , function (req, res) {
    var body = _.pick(req.body, 'description', 'status');
    var attributes = {};

    if (body.hasOwnProperty('status')) {
        attributes.status = body.status;
    }

    // && _.isString(body.description) && body.description.trim().length > 0
    if (body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }

    db.todo.findById(req.params.id)
            .then(function (todo) {
                if (todo) {
                    todo.update(attributes).then(function (todo) {
                        res.json(todo.toJSON());
                    }, function (e) {
                        res.status(400).json(e);
                    });
                } else {
                    res.status(404).send();
                }
            }, function () {
                res.status(500).send();
            });



//    _.extend(matchItem, validAttributes);
});

//----------

//GET /user
app.post('/user', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');

    db.user.create(body)
            .then(function (user) {
                res.json(user.toPublicJSON());
            })
            .catch(function (e) {
                res.status(400).json(e);
            });
});


//POST /user/login
app.post('/user/login', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');

    db.user.auth(body)
            .then(function (user) {
                if (user.getToken('auth')) {
                    res.header('Auth', user.getToken('auth')).json(user.toPublicJSON());
                } else {
                    res.status(401).send();
                }

            })
            .catch(function () {
                res.status(401).send();
            });



});

db.sequelize.sync({force:true})
        .then(function () {
            app.listen(PORT, function () {
                console.log("Server Sterted!");
            });
        });

