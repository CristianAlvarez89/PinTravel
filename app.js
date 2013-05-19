
/**
 * Module dependencies.
 */

var express = require('express')
    mongoose = require('mongoose'),
    index = require('./routes/index'),
    am = require('./routes/account-manager'),
    fm = require('./routes/file-manager'),
    wines = require('./routes/wines'),
    http = require('http'),
    path = require('path'),
    fs = require('fs');

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
  app.use(express.static('users'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/***    Inici Aplicacio    ***/
app.get('/', index.inici);      //Inicia l'aplicacio
app.get('/home', index.home);   //Mostra la pàgina inicial si l'usuari no ha fet el SignIn i la part interna si sí ho ha fet.
app.post('/reset', index.reset);//Permet buidar parametres de la sessio que no es fan servir


/***    Account Manager    ***/
app.post('/sign',am.sign);      //Permet a l'usuari iniciar la sessio en l'aplicacio
app.get('/logout',am.logout);   //Permet a l'usuari tancar la sessio

/***    File Manager    ***/
app.post('/upload',fm.upload);              //Permet a l'usuari pujar una fotografia
app.get('/images',fm.getImg);               //Obte la ruta de totes les imatges de l'usuari
app.get('/images/pin/:id',fm.getImgPin);      //Obte la ruta de les imatges del pin de l'usuari
app.delete('/image/:pinid/:imgname',fm.rmImg); //Elimina una imatge de l'usuari


/*
app.get('/wines',wines.findAll);
app.get('/wines/:id',wines.findById);
app.post('/wines',wines.addWine);
app.put('/wines/:id',wines.updateWine);
app.delete('/wines/:id',wines.deleteWine);
*/


pin = require('./routes/pin')(app);
users = require('./routes/account')(app);
friends = require('./routes/friend')(app);

mongoose.connect('mongodb://localhost/pintravel');

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
