const mongoose = require('mongoose');

const locationPingSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    speed: {
        type: Number,
        default: 0
    },
    heading: {
        type: Number,
        min: 0,
        max: 360
    },
    recordedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: true
});

locationPingSchema.index({location: '2dsphere'});
locationPingSchema.index({vehicle: 1, recordedAt: -1});

module.exports = mongoose.model('LocationPing', locationPingSchema);
