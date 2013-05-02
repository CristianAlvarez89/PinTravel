    module.exports = function(app){

    var Pin = require('../models/pin');

    //Guarda un nou pin al compte de l'usuari
    addPin = function(req, res){
        var pin = new Pin(
            {
                userID:     req.session.userID,
                lat:        req.body.lat,
                long:       req.body.lng,
                town:       req.body.town,
                city:       req.body.city,
                country:    req.body.country
            });
        pin.save();
        res.end();
    };

    //find all pins by a user
    getPins = function(req, res){
        Pin.find({userID:req.params.userID}, function(err, pins) {
            res.send(pins);
        });
    };

    //find pin by id
    getPin = (function(req, res) {
        Pin.findOne({user: req.params.id}, function(error, pin) {
            res.send(pin);
        })
    });

    //Link routes and functions
    app.post('/pin', addPin);
    app.get('/pin/:userID', getPins);
    app.get('/pin/:userID/:id', getPin);
}
