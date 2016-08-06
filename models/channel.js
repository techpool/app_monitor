var mongoose = require('mongoose');

var channelSchema = mongoose.Schema({
	_user: {
    	type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    token: {
    	type: String,
    	required: true,
    	unique: true
    },
    success_pings: {
    	type: Array
    },
    failed_pings: {
    	type: Array
    },
    last_success_ping: {
    	type: Date
    },
    last_failed_ping: {
    	type: Date
    },
    grace: {
    	type: Number,
    	required: true
    },
    limit: {
    	type: Number,
    	required: true
    },
    job_name: {
    	type: String,
    	required: true
    }
});

module.exports = mongoose.model('Channel', channelSchema);