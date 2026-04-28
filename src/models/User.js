const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['superadmin', 'provincial_admin', 'district_officer', 'station_officer', 'operator'],
        required: true
    },
    assignedProvince: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Province'
    },
    assignedDistrict: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District'
    },
    assignedStation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PoliceStation'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);