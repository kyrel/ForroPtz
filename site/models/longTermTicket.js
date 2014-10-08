var mongoose = require('mongoose');

var longTermTicketSchema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    price: Number,
    classAmount: Number,
    classDates: [Date]
});

longTermTicketSchema.statics.findLast = function (userId, callback) {
    this
        .findOne({ userId: userId })
        .sort("-endDate")
        .exec(function (err, longTermTicket) {
            if (!longTermTicket) 
                new LongTermTicket({
                    userId: userId,
                    startDate: new Date(2014, 09, 03),
                    endDate: new Date(2014, 11, 02),
                    price: 60000,
                    classAmount: 8,
                    classDates: [new Date()]
                }).save(callback);
            else callback(err, longTermTicket);
        });
}

var LongTermTicket = mongoose.model('LongTermTicket', longTermTicketSchema);
module.exports = LongTermTicket;