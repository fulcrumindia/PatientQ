const mongoose = require('mongoose');

// schema
const patientSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        unique: false
    },
    symptom: String,
    triageStatus: String,
    enterdate:{
        type: Date,
        default: Date.now
    },
    _queueId: {
        type: String,
        ref: 'Queue'
    }
});

const Patient = module.exports = mongoose.model('Patient', patientSchema);

// get Patients
module.exports.getPatients = (callback, limit) => {
    Patient.find(callback).limit(limit);
}

// get Patients by id
module.exports.getPatientById = (_id, callback) => {
    Patient.findById(_id, callback)
}

// add Patient
module.exports.addPatient = (patient,callback) => {
    Patient.create(patient,callback);
}

// update Patient queue id
module.exports.updatePatientQueueId = (_id,patient,options,callback) => {
    Patient.findByIdAndUpdate(_id, patient, options, callback);
}