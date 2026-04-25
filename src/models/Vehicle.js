const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
        required: true
    },
    make: {
        type: String,
        trim: true
    }, 
    model: {
        type: String,
        trim: true
    },
    year: {
        type: String,
    },
    color: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'deregistered'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);