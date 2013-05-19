

/* File Uploader to User Pin folder */

exports.upload = function(req, res)
{
    var tmp_path = req.files.imatge.path;
    var nom_imatge = req.body.imgUploadPinName+"__"+Date.now()+req.files.imatge.name.substr(req.files.imatge.name.lastIndexOf('.'),req.files.imatge.name.length);
    console.log("Pin ID: "+req.body.imgUploadPinID);
    var target_path = 'users/'+req.session.username+'/'+req.body.imgUploadPinID+'/'+nom_imatge;

    fs.rename(tmp_path, target_path, function(err)
    {
        // delete the temporary file
        fs.unlink(tmp_path, function(){ if (err) console.log(err);});

        if (err) req.session.uploadimage = "Image could not be uploaded";
        else req.session.uploadimage = "Image was uploaded properly ";
        console.log(req.session.uploadimage);
        res.redirect('home');
    });
};


/* Get all user images */

exports.getImg = function(req, res)
{
    if (req.session.username == undefined) res.send({status:'nok'});
    else
    {
        var dir = 'users/'+req.session.username+'/';    //Directori de l'usuari
        walk(dir, function(err, results) {
            if (err) throw err;

            //El resultat sobte dins dun array
            //Es transforma en un JSON que es pasara al plugin FancyBox
            var result = "";
            for (var i=0;i<results.length;i++)
            {
                var href = results[i].substr(results[i].indexOf('/')+1,results[i].length-6);
                var name = results[i].substr(results[i].lastIndexOf('/')+1,results[i].lastIndexOf('.')-results[i].lastIndexOf('/')-1);
                result += '{"href":"'+href+'";"title":"'+name.substr(0,name.lastIndexOf('__'))+'"},';
            }
            result = result.substr(0,result.length-1);
            res.send(result);
        });
    }
};


/* Obte la ruta de les imatges del pin de l'usuari */

exports.getImgPin = function(req, res)
{
    if (req.session.username == undefined) res.send({status:'nok'});
    else
    {
        var dir = 'users/'+req.session.username+'/'+req.params.id+'/';    //Directori de l'usuari
        fs.exists(dir,function(exists)
        {
            if (!exists) res.send('nok');
            else
            {
                walk(dir, function(err, results) {
                    if (err) throw err;

                    //El resultat sobte dins dun array
                    //Es transforma en un JSON que es pasara al plugin FancyBox
                    var result = "";
                    for (var i=0;i<results.length;i++)
                    {
                        var href = results[i].substr(results[i].indexOf('/')+1,results[i].length-6);
                        var name = results[i].substr(results[i].lastIndexOf('/')+1,results[i].lastIndexOf('.')-results[i].lastIndexOf('/')-1);
                        result += '{"href":"'+href+'";"title":"'+name.substr(0,name.lastIndexOf('__'))+'"},';
                    }
                    result = result.substr(0,result.length-1);
                    res.send(result);
                });
            }
        });
    }
};


exports.rmImg = function(req,res)
{
     console.log(req.params.pinid);
     console.log(req.params.imgname);
     console.log(req.session.username);
    res.send({folder:'users/'+req.session.username+'/'+req.params.pinid+'/'+req.params.imgname});
    //fs.unlink(path);
};


//Funcio recursiva que obte tots els fitxers d'una carpeta
function walk(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory())
                {
                    walk(file, function(err, res)
                    {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                }
                else
                {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};