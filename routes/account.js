    module.exports = function(app){

    var Users = require('../models/account');

    //Obte tots els noms dusuari de la base de dades
    getUsers = function(req, res){
        Users.find({},'username',function(error, users) {
            console.log('Error: '+error);
            console.log('Users: '+users);
            res.send(users);
        });
    };


    /***    Users API    ***/
    app.get('/users', getUsers);           //JSON amb la llista dels usuaris registrats
}
