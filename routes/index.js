
/*
 * GET home page.
 */

exports.inici = function(req, res)
{
    if (!req.session.username)
        res.render('login/index');
    else
        res.render('home/index',{username:req.session.username, new_user: false});
};

exports.home = function(req, res){
    if (!req.session.username)
        res.redirect('/');
    else
        res.render('home/index', {username: req.session.username, new_user: req.session.new_user});

    //res.render('home/index', {username: 'username', new_user: false});
};