    module.exports = function(app){

    var Pin = require('../models/pin');

    //Guarda un nou pin al compte de l'usuari
    addPin = function(req, res){
        Pin.find(
            {userID:req.session.userID,lat:req.body.lat,long:req.body.lng},
            function(error, pins)
            {
                if (pins.length == 0)
                {
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
                    res.send({free:true});
                }
                else
                    res.send({free:false});
            });
    };

    //find all pins by a user
    getPins = function(req, res){
        Pin.find({userID:req.session.userID}, function(error, pins) {
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
    app.get('/pin', getPins);
    app.get('/pin/:userID/:id', getPin);
}
