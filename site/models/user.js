var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    vkId: Number
});

var User = mongoose.model('User', userSchema);
module.exports = User;