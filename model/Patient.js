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

// add Patient
module.exports.addPatient = (patient,callback) => {
    Patient.create(patient,callback);
}