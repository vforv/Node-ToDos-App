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

app.get('/todos', function (req, res) {
    res.json(todos);
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
app.delete('/todos/:id', function(req, res) {
    var matchItem = _.findWhere(todos, {id: parseInt(req.params.id)});
    
    
    if(!matchItem) {
        res.status(404).json({"error":"No items"});
    } else {
           todos = _.without(todos, matchItem);
           res.json(matchItem);
    }
});

app.listen(PORT, function () {
    console.log("Server Sterted!");
});
