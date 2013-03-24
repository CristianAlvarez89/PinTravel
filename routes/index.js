
/*
 * GET home page.
 */

exports.index = function(req, res)
{
    if (!req.session.username)
        res.render('login/index');
    else
        res.render('home/index');
};