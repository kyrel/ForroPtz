﻿var express = require('express');
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

var opts = { server: { socketOptions: { keepAlive: 1 } } };
mongoose.connect(credentials.mongo.development.connectionString, opts);

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
    User.find({ vkId: uid }, function (err, users) {
        if (err) {
            console.log("Find user error:", err);
            response.send('');
            return;
        }
        var user = users[0];
        if (!user) {
            user = {
                firstName: 'Ваня',
                lastName: 'Ванечкин',
                vkId: uid
            };
            console.log('Nobody found, create new user:');
            console.log(user);
            new User(user).save();
        }
        request.session.user = {
            firstName: user.firstName,
            lastName: user.lastName,
            vkId: user.vkId
        };
        response.send('');
    });
});

app.post('/auth/signOut', function (request, response) {
    delete request.session.user;
    response.send('');
});


app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port'));
})