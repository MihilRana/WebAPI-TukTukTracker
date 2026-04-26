const mongoose = require('mongoose');

const policeStationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
        required: 'true'
    },
    contactNumber: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PoliceStation', policeStationSchema);