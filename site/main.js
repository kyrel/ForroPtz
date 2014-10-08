var express = require('express');
var md5 = require('MD5');
var mongoose = require('mongoose');
var credentials = require('./credentials');
var User = require('./models/user');

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
    var user = request.session.user;
    var viewModel = { isAuthenticated: !!user };
    if (user)
        viewModel.user = {
            firstName: user.firstName,
            lastName: user.lastName
        };

    response.render('index', viewModel);
});

var opts = { server: { socketOptions: { keepAlive: 1 } } };
mongoose.connect(credentials.mongo.development.connectionString, opts);
/*switch (app.get('env')) {
    case 'development':
        mongoose.connect(credentials.mongo.development.connectionString, opts);
        break;
    case 'production':
        mongoose.connect(credentials.mongo.production.connectionString, opts);
        break;
    default:
        throw new Error('Unknown execution environment: ' + app.get('env'));
}*/

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
    var user = {};
    User.find({ available: true }, function (err, users) {
        console.log("err:", err);
        console.log("users:", users);
        user = users[0];
        if (!user) {
            user = {
                firstName: 'Ваня',
                lastName: 'Ванечкин',
                vkId: uid
            };
            console.log('нет никого');
            new User(user).save();
        }
    });
    request.session.user = user;
    response.send('');
});

app.post('/auth/signOut', function (request, response) {
    delete request.session.user;
    response.send('');
});


app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port'));
})