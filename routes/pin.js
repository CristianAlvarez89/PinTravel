module.exports = function(app){

    var Pin = require('../models/pin');

    //Create a new pin and save it
    pin = function(req, res){
        var pin = new Pin({user: req.body.user, lat: req.body.lat, long: req.body.long});
        pin.save();
        res.end();
    };

    //find all pins
    list = function(req, res){
        Pin.find(function(err, pins) {
            res.send(pins);
        });
    };

    //find all pins by a user
    listByID = function(req, res){
        Pin.find({user:req.params.userID}, function(err, pins) {
            res.send(pins);
        });
    };

    //find pin by id
    find = (function(req, res) {
        Pin.findOne({user: req.params.id}, function(error, pin) {
            res.send(pin);
        })
    });

    //Link routes and functions
    app.post('/pin', pin);
    app.get('/pin', list);
    app.get('/pin/:userID', listByID);
    app.get('/pin/:id', find);
}
