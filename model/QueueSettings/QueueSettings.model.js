'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var queueSettingsSeed = require('./QueueSettings.seed.json');

var QueueSettingsSchema = new Schema({
    kioskPhoneNumberStatus: {type: Boolean, default: false},
    waitMessageStatus: {type: Boolean, default: false},
    updateMessageStatus: {type: Boolean, default: false},
    transferQueueMessageStatus: {type: Boolean, default: false},
    replyLMessageStatus: {type: Boolean, default: false},
    replySMessageStatus: {type: Boolean, default: false},
    reminderMessageStatus: {type: Boolean, default: false},
    multipleReservationStatus: {type: Boolean, default: false},
    departmentName: String,
    supportemail: {type: String, lowercase: true},
    waitMessage: String,
    updateMessage: String,
    transferQueueMessage: String,
    replyLMessage: String,
    replySMessage: String,
    reminderMessage: String,
    notificationTime: String,
    support_number: {type: Number, default: 0},
    account_id: {type: String}
});

const QueueSettings =  module.exports = mongoose.model('QueueSettings', QueueSettingsSchema);

module.exports.getQueueSettings = (callback) =>{
    QueueSettings.find({account_id:"TD6DHW9W9E2U9EU2"},function (err, things) {
        if(err) {
            QueueSettings.create(queueSettingsSeed, function(error, thing) {
                if(err) {
                    callback(error,null)
                }else {
                    callback(null, thing)
                }
            });
        }else{
            callback(null,things[0])
        }

    });
}

// update Queue
module.exports.updateQueuesettings = (_id, queue, options, callback) => {
    Queue.findByIdAndUpdate(_id, queue, options, callback);
}
