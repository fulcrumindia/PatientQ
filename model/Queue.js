const mongoose = require('mongoose');

// schema
const queueSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    type: String,
    description: String,
    color:{
        type: String,
        default: '#fa7a7a'
    },
    queuesms: String,
    visitsms: String,
    disablequeuesms:{
        type: Boolean,
        required: true,
        default: 0
    },
    isdefault:{
        type: Boolean,
        required: true,
        default: 0
    },
    enterdate:{
        type: Date,
        default: Date.now
    },
    userid: {
        type: String,
        required: true
    },
    waitime: String,
    _patientIds: [{type: mongoose.Schema.Types.ObjectId, ref: "Patient"}]
});

const Queue = module.exports = mongoose.model('Queue', queueSchema);

// get Queue
module.exports.getQueues = (callback, limit) => {
    Queue.find(callback).populate('_patientIds').limit(limit).exec();
}

// get Queue by Id
module.exports.getQueueById = (id, callback) => {
    Queue.findById(id, callback)
}

// Add Queue
module.exports.addQueue = (queue, callback) => {
    Queue.create(queue, callback);
}

// update Queue
module.exports.updateQueue = (_id, queue, options, callback) => {
    Queue.findByIdAndUpdate(_id, queue, options, callback);
}

// delete Queue
module.exports.deleteQueue = (_id, callback) => {
    var query = {_id: _id};
    Queue.remove(query, callback);
}

// find Queue by type
module.exports.findQueueByType = (type, callback) => {
    var query = {type: type};
    //console.log(query);
    Queue.find(query, callback);
}