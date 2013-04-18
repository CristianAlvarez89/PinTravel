var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var pinSchema = new Schema({
    user: String,
    lat: Number,
    long: Number
});

//Export the schema
module.exports = mongoose.model('Pin', pinSchema);
