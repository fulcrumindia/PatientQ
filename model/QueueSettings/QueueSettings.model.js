'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
    support_number: {type: Number, default: 0}
});

module.exports = mongoose.model('QueueSettings', QueueSettingsSchema);