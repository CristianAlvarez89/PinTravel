
/**
 * Module dependencies.
 */

var express = require('express')
    mongoose = require('mongoose'),
    routes = require('./routes/'),
    am = require('./routes/account-manager'),
    home = require('./routes/home'),
    user = require('./routes/user'),
    wines = require('./routes/wines'),
    http = require('http'),
    path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "test" }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/sign',am.sign);

app.get('/home', home.index);


app.get('/users', user.list);

app.get('/wines',wines.findAll);
app.get('/wines/:id',wines.findById);
app.post('/wines',wines.addWine);
app.put('/wines/:id',wines.updateWine);
app.delete('/wines/:id',wines.deleteWine);



//app.get('/signup',am.signup);
app.post('/signup',user.signup);
app.get('/logout',am.logout);


pin = require('./routes/pin')(app);

mongoose.connect('mongodb://localhost/pintravel');

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
