var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var _ = require("underscore");
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
    var filtredTodos = todos;
    
    if (queryParams.hasOwnProperty('status') && queryParams.status === 'true') {
        filtredTodos = _.where(filtredTodos, {status: true});
    }else if (queryParams.hasOwnProperty('status') && queryParams.status === 'false'){
        filtredTodos = _.where(filtredTodos, {status: false});
    }
    
    res.json(filtredTodos);
});

//GET /todos/:id
app.get('/todos/:id', function (req, res) {

    var stringRet = _.findWhere(todos, {id: parseInt(req.params.id)});

    if (stringRet) {
        res.json(stringRet);
    } else {
        res.status(404).send();
    }
});

//POST /todos
app.post('/todos', function (req, res) {
    var body = req.body;

    todos.push({
        'id': id++,
        'description': body.description,
        'status': body.status
    });

    res.json(body);
});

// DELETE /todos
app.delete('/todos/:id', function (req, res) {
    var matchItem = _.findWhere(todos, {id: parseInt(req.params.id)});


    if (!matchItem) {
        res.status(404).json({"error": "No items"});
    } else {
        todos = _.without(todos, matchItem);
        res.json(matchItem);
    }



});

//PUT /todos/:id
app.put('/todos/:id', function (req, res) {
    var matchItem = _.findWhere(todos, {id: parseInt(req.params.id)});
    var body = _.pick(req.body, 'description', 'status');
    var validAttributes = {};

    if (!matchItem) {
        return res.status(404).send();
    }
    if (body.hasOwnProperty('status')) {
        validAttributes.status = body.status;
    } else if (body.hasOwnProperty('status')) {
        return res.status(400).send();
    }


    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.descrition = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    _.extend(matchItem, validAttributes);
    res.json(matchItem);
});


app.listen(PORT, function () {
    console.log("Server Sterted!");
});
