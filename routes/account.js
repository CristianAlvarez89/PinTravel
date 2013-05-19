    module.exports = function(app){

    var Users = require('../models/account');

    //Obte tots els noms dusuari de la base de dades
    getUsers = function(req, res){
        Users.find({_id:{$ne:req.session.userID}},'username',function(error, users) {
            res.send(users);
        });
    };

    //Obte la informacio del usuari
        getUserInfo = function(req, res){
        Users.findOne(
            {username:req.params.name},
            function(error, user)
            {
                if (user == null) res.send({status:'ok',found:false});
                else
                {
                    res.send({status:'ok',found:true, user:user.username, userID:user._id});
                }
            });
    };


    /***    Users API    ***/
    app.get('/users', getUsers);           //JSON amb la llista dels usuaris registrats
    app.get('/users/:name', getUserInfo);  //JSON amb la informacio del usuari
}
