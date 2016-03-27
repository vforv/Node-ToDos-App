var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var PORT = process.env.PORT || 3000;


var id = 1;

app.use(bodyParser.json());

var todos = [
    
];

app.get('/', function (req, res) {
    res.send("Hello Wrold");
});

app.get('/todos', function(req,res){
   res.json(todos); 
});

app.get('/todos/:id',function(req, res){
    var stringRet;
    todos.forEach(function(todo){
       if(todo.id === parseInt(req.params.id)) {
           stringRet = todo;
           
       }
    });
    
    if ( typeof stringRet === "undefined") {
        res.status(404).send();
    }else{
        res.json(stringRet);
    }
});

app.post('/todos', function(req, res){
    var body = req.body;
    
    todos.push({
        'id'    : id++,
        'description' : body.description,
        'status' :  body.status
    });
    
    res.json(body);
});

app.listen(PORT, function () {
    console.log("Server Sterted!");
});
