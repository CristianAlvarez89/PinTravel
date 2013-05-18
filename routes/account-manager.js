var crypto = require('crypto');
var algorithm = 'aes256';
var key = 'Text llarg que farà de clau per a xifrar les contrasenyes';

/*
var text = 'this is a secret';

var cipher = crypto.createCipher(algorithm, key);
var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');

var decipher = crypto.createDecipher(algorithm, key);
var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
*/


var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var dbName      = 'pintravel';


/* Connexio base de dades */

var db = new MongoDB(dbName, new Server('localhost', 27017, {auto_reconnect: true}), {w: 1});
db.open(function(error, d) {
    if (error)
        console.log(error);
    else
        console.log("connected to '"+ dbName +"' database.");
});
var accounts = db.collection('accounts');


/* Importacio del modul Validator */

var check = require('validator').check,
    sanitize = require('validator').sanitize;



/* Inici de sessio i registre de l'usuari */

exports.sign = function(req, res)
{
    if (req.body.form == 'in') doSignIn(req,res);       //Inici de sessio de l'usuari
    else if (req.body.form == 'up') doSignUp(req,res);  //Registre de l'usuari
    else console.log('Something went bad in sign form');//Qualsevol altre parametre no esperat
};



/* Tanca la sessio de l'usuari */

exports.logout = function(req, res)
{
    if (req.session.username) req.session.destroy();
    res.redirect('/');
};




function doSignIn(req,res)
{
    var json_result  = {};

    /* Email validation */
    if (req.body.email != "")
        try {
            check(req.body.email).isEmail()
            json_result.email = true;
        } catch(e) {
            console.log(e.message)
            json_result.email = e.message;  //Incorrect email
        }
    else json_result.email = "Empty email";

    /* Password validation */
    json_result.pass = (req.body.pass != "") ? true : "Empty password";

    /* Sign in validation */
    if (json_result.email && json_result.pass)
    {   accounts.findOne({email:req.body.email},function(err,obj)
        {
            if (obj == null)
            {
                console.log('User not found');
                json_result.signin = false;
            }
            else
            {
                var cipher = crypto.createCipher(algorithm, key);
                var encrypted = cipher.update(req.body.pass, 'utf8', 'hex') + cipher.final('hex');
                if (obj.pass == encrypted)
                {
                    req.session.username = obj.username;
                    req.session.userID = obj._id;
                    req.session.newLogIn = 'true';
                    json_result.signin = true;
                }
                else
                {
                    json_result.pass = "Incorrect pass";
                    json_result.signin = false;
                }
            }
            console.log(json_result);
            res.send(json_result);
        });
    }
    else
    {
        json_result.signin = false;
        res.send(json_result);
    }
}

function doSignUp(req, res)
{
    var json_result  = {};

    /* Username validation */
    if (req.body.username != "")
        try {
            check(req.body.username).isAlphanumeric()
            json_result.username = true;
        } catch(e) {
            console.log(e.message)
            json_result.username = e.message;   //No alfanumèric
        }
    else
        json_result.username = "Empty username";


    /* Email validation */
    if (req.body.email != "")
        try {
            check(req.body.email).isEmail()
            json_result.email = true;
        } catch(e) {
            console.log(e.message)
            json_result.email = e.message;  //Incorrect email
        }
    else json_result.email = "Empty email";

    if (req.body.pass != "")
        if (req.body.pass == req.body.passmatch)
        {
            json_result.pass = true;
            json_result.passmatch = true;
        }
        else
        {
            json_result.pass = "";
            json_result.passmatch = "Passwords doesn't match";
        }
    else
    {
        json_result.pass = "Empty password";
        json_result.passmatch = "";
    }

    if (json_result.username == true && json_result.email == true && json_result.passmatch == true)
    {
        addNewUser(req, res, json_result, function(e)
        {
            json_result.signup = e;
            console.log('Errooorr: '+e);
            res.send(json_result);
        });
    }
    else
    {
        json_result.signup = false;
        res.send(json_result);
    }
}

function addNewUser(req, res, json_result, callback)
    {
        accounts.findOne({username:req.body.username},function(err,obj)
        {
            if (obj)
            {
                json_result.signup = false;
                json_result.username = false;
                callback('Username taken');
            }
            else
            {
                accounts.findOne({email:req.body.email},function(err,obj)
                {
                   if (obj)
                   {
                       json_result.signup = false;
                       json_result.email = false;
                       callback('Email taken');
                   }
                   else
                   {
                        var cipher = crypto.createCipher(algorithm, key);
                        var encrypted = cipher.update(req.body.pass, 'utf8', 'hex') + cipher.final('hex');

                        accounts.insert({username:req.body.username, email: req.body.email, pass: encrypted},function(err,obj)
                        {
                            if (obj == null)
                            {
                                json_result.signup = false;
                                callback('Error registering');
                            }
                            else
                            {
                                fs.mkdir('users/'+req.body.username);
                                json_result.signup = true;
                                req.session.username = req.body.username;
                                req.session.userID = obj._id;
                                req.session.new_user = true;
                                res.send(json_result);
                            }
                        });
                   }
                });
            }
        });
    }