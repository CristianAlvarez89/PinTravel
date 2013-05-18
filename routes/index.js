
/*
 * GET home page.
 */

exports.inici = function(req, res)
{
    if (!req.session.username)
        res.render('login/index');
    else
        res.render('home/index',{username:req.session.username, imageupload:null, new_user: null, newLogIn:null});
};

exports.home = function(req, res){
    if (!req.session.username)
        res.redirect('/');
    else
        res.render('home/index',
            {
                username: req.session.username,
                new_user: req.session.new_user,
                imageupload: req.session.uploadimage,
                newLogIn: req.session.newLogIn
            });

    //res.render('home/index', {username: 'username', new_user: false});
};

exports.reset = function(req, res){
    req.session.new_user = null;
    req.session.imageupload = null;
    req.session.newLogIn = null;
    res.send('ok');
};