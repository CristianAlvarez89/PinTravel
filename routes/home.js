
/*
 * GET home page.
 */

exports.index = function(req, res){
    if (!req.session.username)
        res.redirect('/');
    else
        res.render('home/index', {username: req.session.username, new_user: req.session.new_user});
};