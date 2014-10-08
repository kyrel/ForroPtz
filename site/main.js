var express = require('express');
var md5 = require('MD5');
var credentials = require('./credentials');

var app = express();
var handlebars = require('express-handlebars').create({
    extname: '.html'
});
app.engine('.html', handlebars.engine);
app.set('view engine', '.html');
app.set('port', process.env.PORT || 80);

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());
app.use(require('body-parser')());
app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
    console.log("inside get /");
    console.log(request.session);
    var isAuthenticated = !!request.session.user;
    response.render('index', { isAuthenticated: isAuthenticated });
});

app.post('/auth/signIn', function (request, response) {
    var appId = '4580391';
    var uid = request.body.uid;
    var secretKey = '2iulmWM5YIBeOtvS1wo1';
    var hash = request.body.hash;
    if (md5(appId + uid + secretKey) !== hash) {
        console.log('Invalid VK.com credentials! Possible attack detected');
        response.status(403);
        response.send('');
        return;
    }
    var user = {
        uid: uid
    };
    request.session.user = user;
    response.send('');
});

app.post('/auth/signOut', function (request, response) {
    console.log('inside signOut');
    delete request.session.user;
    response.send('');
});


app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port'));
})