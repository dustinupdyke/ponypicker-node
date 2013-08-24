var express = require('express'),
    ponies = require('./routes/ponies');
 
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});
 
app.get('/ponies', ponies.findAll);
//app.get('/ponies/:id', ponies.findById);
app.get('/ponies/:name', ponies.findByName);

 
app.listen(3000);
console.log('Listening on port 3000...');