var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var pinSchema = new Schema({
    userID: Schema.ObjectId,
    lat: Number,
    long: Number,
    town:String,
    city:String,
    country:String
});

//Export the schema
module.exports = mongoose.model('Pin', pinSchema);
