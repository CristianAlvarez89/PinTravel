    module.exports = function(app){

    var Friend = require('../models/friend');

    //Obte tots els noms dusuari de la base de dades
    getFriends = function(req, res){
        Friend.find({userID:req.session.userID},function(error, friends) {
            res.send({userID:friends.userID, friendID:friends.friendID});
        });
    };

    //Obte un usuari amic
    getFriend = function(req, res){
        Friend.findOne({userID:req.session.userID, friendID:req.params.id},function(error, friends) {
            if(req.session.userID == undefined)  res.send({status:false});
            else if (friends == null) res.send({friend:false});
            else res.send({friend:true});
        });
    };

    //Afegeix un nou amic a l'usuari actual
    addFriends = function(req, res){
        if(req.session.userID == undefined)  res.send({status:false});
        else
        {
            var friend = new Friend(
                {
                    userID:     req.session.userID,
                    friendID:   req.body.friendID
                });
            friend.save();
            res.send({status:true});
        }
    };

    //Elimina a un usuari amic
        removeFriend = function(req, res){
        Friend.findOne({userID:req.session.userID, friendID:req.params.id},function(error, friend) {
            if(req.session.userID == undefined)  res.send({status:false});
            else if (friend == null) res.send({removed:false});
            else
            {
                friend.remove();
                res.send({removed:true});
            }
        });
    };

    /***    Users API    ***/
    app.get('/friends', getFriends);            //JSON amb la llista dels usuaris registrats
    app.get('/friends/:id', getFriend);         //Obte un usuari amic
    app.post('/friends', addFriends);           //Afegeix un nou amic
    app.delete('/friends/:id', removeFriend);   //Elimina a un amic
}
