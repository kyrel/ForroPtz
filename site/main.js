var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({
    extname: '.html'
});
app.engine('.html', handlebars.engine);
app.set('view engine', '.html');
app.set('port', process.env.PORT || 80);

app.use(express.static(__dirname + '/public'));
app.get('/', function (request, response) {
    response.render('index');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port'));
})