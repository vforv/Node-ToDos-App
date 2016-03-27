var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [
    {
        id: 1,
        description: 'I am Vladimir.',
        completed: true
    },
    {
        id: 2,
        description: "Learn Node.js",
        completed: false
    }
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

app.listen(PORT, function () {
    console.log("Server Sterted!");
});
