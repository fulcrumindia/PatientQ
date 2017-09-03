var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
//var md5 = require('md5');
//User schema
const userSchema = mongoose.Schema({
/*    local            : {
        email        : String,
        password     : String,
    },*/
    username: {
        type: String,
        maxlength: 100,
        required: true
    },
    password: {
        type: String,
        maxlength: 100,
        required: true
    },
    userLevel: {
        type: String,
        required: true
    },
    isRemoved: {
        type: Boolean,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    accountId: {
        type: String,
        required: false,
        //ref: 'Account'
    },
    enterdate: {
        type: Date,
        default: Date.now
    },
    createdby: {
        type: String,
        required: true
    },
    modifiedby: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    modefiedDate: {
        type: Date,
    },
});

/*const User = module.exports = mongoose.model('User', userSchema);

// Add User
module.exports.addUser = (user, callback) => {
    User.create(user, callback);
}
*/

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    //return md5(password);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
    //return md5(password);
};

module.exports = mongoose.model('User', userSchema);