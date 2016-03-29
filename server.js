var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var _ = require("underscore");
var db = require('./db.js');
var PORT = process.env.PORT || 3000;
var id = 1;
app.use(bodyParser.json());
var todos = [
];
app.get('/', function (req, res) {
    res.send("Hello Wrold");
});
//GET /todos?status=true
app.get('/todos', function (req, res) {

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
app.get('/todos/:id', function (req, res) {

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
app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'status');
    db.todo.create(body)
            .then(function (todo) {
                res.json(todo.toJSON());
            })
            .catch(function (e) {
                res.status(400).json(e);
            });
});

// DELETE /todos
app.delete('/todos/:id', function (req, res) {
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
app.put('/todos/:id', function (req, res) {
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


db.sequelize.sync()
        .then(function () {
            app.listen(PORT, function () {
                console.log("Server Sterted!");
            });
        });

