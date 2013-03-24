
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , login = require('./routes/login')
  , home = require('./routes/home')
  , user = require('./routes/user')
  , wines = require('./routes/wines')
  , http = require('http')
  , path = require('path');

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
app.get('/users', user.list);

app.get('/home', home.index);

app.get('/wines',wines.findAll);
app.get('/wines/:id',wines.findById);
app.post('/wines',wines.addWine);
app.put('/wines/:id',wines.updateWine);
app.delete('/wines/:id',wines.deleteWine);

app.get('/login',login.login);
app.post('/login',login.doLogin);

app.get('/logout',login.logout);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
