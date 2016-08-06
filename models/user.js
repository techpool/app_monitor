var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var userSchema = mongoose.Schema({
    email: {
    	type: String,
    	required: true,
        unique: true
    },
    name: {
    	firstname: {
    		type: String,
    		required: true
    	},
    	lastname: {
    		type: String
    	}
    },
    password: {
    	type: String,
    	required: true
    },

}, {
	timestamps: {
		createdAt: 'created_at' 
	}
});

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.validatePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err){
            return callback(err);
        }
        callback(null, isMatch);
    });
};

// Virtual function to get the full name when 
// name.full of the Users object is invoked
userSchema.virtual('name.full').get(function () {
	return this.name.first + ' ' + this.name.last;
});

module.exports = mongoose.model('User', userSchema);