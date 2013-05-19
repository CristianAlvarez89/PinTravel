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
                    fs.mkdir('users/'+req.session.username+'/'+pin._id);
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

    //Obte els pins d'un usuari
    getUserPins = function(req, res){
        Pin.find({userID:req.params.id}, function(error, pins) {

            var jsonObj = [];
            for (var i=0;i<pins.length;i++)
                jsonObj.push({town:pins[i].town,city:pins[i].city,country:pins[i].country});

            res.send(jsonObj);
        });
    };

    //delete a user pin by id
    deletePin = function(req, res) {
        if (req.session.userID == undefined) res.send({status:'nok'});
        else
        {
            Pin.findOne
            (
                 {userID:req.session.userID,_id:req.body.id},
                 function(error, pin)
                 {
                     if (pin == null) res.send({status:'ok',removed:false});
                     else
                     {
                         deletePinFolder('users/'+req.session.username+'/'+pin._id);
                         pin.remove();
                         res.send({status:'ok',removed:true});
                     }
                 }
            )
        }
    };


    /***    Pin API    ***/

    app.post('/pin', addPin);           //Guarda el pin al compte de l'usuari
    app.get('/pin', getPins);           //Obte els pins de l'usuari que te iniciada la sessio
    app.get('/pin/:id', getUserPins);   //Obte els pins d'un usuari
    app.delete('/pin', deletePin);      //Esborra el pin d'un usuari
}



function deletePinFolder(dir)
{
    console.log('Delte folder -> '+dir);
    if( fs.existsSync(dir) ) {
        fs.readdirSync(dir).forEach(function(file,index){
            var curPath = dir + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deletePinFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dir);
    }
}
