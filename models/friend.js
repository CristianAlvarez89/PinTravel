var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    userID: String,
    friendID: String
});

//Export the schema
module.exports = mongoose.model('Friend', userSchema);
