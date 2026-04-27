const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Province',
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('District', districtSchema);