const mongoose = require('mongoose');

// schema
const kioskSettingSchema = mongoose.Schema({
    fieldName: String,
    fieldType: String,
    defaultValue: String,
    /*accountId: {
        type: String,
        required: true
    },*/
});

const KioskSetting = module.exports = mongoose.model('KioskSetting', kioskSettingSchema);

// Get KioskSetting by Account Id
module.exports.getKioskSettingId = (accountId, callback) => {
    KioskSetting.findById(accountId, callback)
}

// Add KioskSetting
module.exports.addKioskSetting = (kioskSetting, callback) => {
    KioskSetting.create(kioskSetting, callback);
}

// Update KioskSetting
module.exports.updateKioskSetting = (_id, kioskSetting, options, callback) => {
    Queue.findByIdAndUpdate(_id, kioskSetting, options, callback);
}
