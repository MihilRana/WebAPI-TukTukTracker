const validateLocationPing = (req, res, next) => {
    const { vehicleId, latitude, longitude, speed, heading } = req.body;
    const errors = [];

    if (!vehicleId) errors.push('vehicleId is required');

    if (latitude === undefined || latitude === null) {
        errors.push('latitude is required');
    } else if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
        errors.push('latitude must be a number between -90 and 90');
    }

    if (longitude === undefined || longitude === null) {
        errors.push('longitude is required');
    } else if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
        errors.push('longitude must be a number between -180 and 180');
    }

    if (speed !== undefined && (typeof speed !== 'number' || speed < 0)) {
        errors.push('speed must be a positive number');
    }

    if (heading !== undefined && (typeof heading !== 'number' || heading < 0 || heading > 360)) {
        errors.push('heading must be a number between 0 and 360');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: true,
            message: 'Validation failed',
            details: errors
        });
    }

    next();
};

const validateRegistration = (req, res, next) => {
    const { username, password, role } = req.body;
    const errors = [];
    const validRoles = ['superadmin', 'provincial_admin', 'district_officer', 'station_officer', 'operator'];

    if (!username || username.length < 3) {
        errors.push('Username must be at least 3 characters');
    }

    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }

    if (!role || !validRoles.includes(role)) {
        errors.push(`Role must be one of: ${validRoles.join(', ')}`);
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: true,
            message: 'Validation failed',
            details: errors
        });
    }

    next();
};

module.exports = { validateLocationPing, validateRegistration };