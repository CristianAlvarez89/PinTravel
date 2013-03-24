exports.login = function(req, res){
    res.render('login/index');
};

exports.doLogin = function(req, res)
{
    var post = req.body;
    if ((post.email == 'as@as.as') && (post.pass == 'as'))
    {
        req.session.username = post.email;
        res.redirect('/home');
    }
    else
        res.redirect('/');
};

exports.logout = function(req, res)
{
    if (req.session.username)
        req.session.destroy();

    res.redirect('/');
};