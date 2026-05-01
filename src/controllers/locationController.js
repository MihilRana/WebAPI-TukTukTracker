const LocationPing = require('../models/LocationPing');
const Vehicle = require('../models/Vehicle');

const createLocationPing = async (req, res, next) => {
    try {
        const { vehicleId, latitude, longitude, speed, heading } = req.body;

        if (!vehicleId || latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                error: true,
                message: 'Vehicle ID, latitude, and longitude are required'
            });
        }

        if (latitude < -90 || latitude > 90) {
            return res.status(400).json({
                error: true,
                message: 'Latitude must be between -90 and 90'
            });
        }

        if (longitude < -180 || longitude > 180) {
            return res.status(400).json({
                error: true,
                message: 'Longitude must be between -180 and 180'
            });
        }

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({
                error: true,
                message: 'Vehicle not found'
            });
        }

        if (vehicle.status !== 'active') {
            return res.status(400).json({
                error: true,
                message: 'Cannot send location pings for inactive vehicles'
            });
        }

        const ping = await LocationPing.create({
            vehicle: vehicleId,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            },
            speed: speed || 0,
            heading: heading || 0,
            recordedAt: new Date()
        });

        res.status(201).json({
            error: false,
            message: 'Location ping recorded',
            data: ping
        });
    } catch (error) {
        next(error);
    }
};

const createBulkPings = async (req, res, next) => {
    try {
        const { pings } = req.body;

        if (!pings || !Array.isArray(pings) || pings.length === 0) {
            return res.status(400).json({
                error: true,
                message: 'An array of pings is required'
            });
        }

        if (pings.length > 100) {
            return res.status(400).json({
                error: true,
                message: 'Maximum 100 pings per batch'
            });
        }

        const formattedPings = [];
        const errors = [];

        for (let i = 0; i < pings.length; i++) {
            const p = pings[i];

            if (!p.vehicleId || p.latitude === undefined || p.longitude === undefined) {
                errors.push({ index: i, message: 'Missing vehicleId, latitude, or longitude' });
                continue;
            }

            if (p.latitude < -90 || p.latitude > 90 || p.longitude < -180 || p.longitude > 180) {
                errors.push({ index: i, message: 'Invalid coordinates' });
                continue;
            }

            formattedPings.push({
                vehicle: p.vehicleId,
                location: {
                    type: 'Point',
                    coordinates: [p.longitude, p.latitude]
                },
                speed: p.speed || 0,
                heading: p.heading || 0,
                recordedAt: p.recordedAt ? new Date(p.recordedAt) : new Date()
            });
        }

        let created = [];
        if (formattedPings.length > 0) {
            created = await LocationPing.insertMany(formattedPings);
        }

        res.status(201).json({
            error: false,
            message: `${created.length} pings recorded`,
            data: {
                inserted: created.length,
                failed: errors.length,
                errors: errors.length > 0 ? errors : undefined
            }
        });
    } catch (error) {
        next(error);
    }
};

const getLastLocation = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({
                error: true,
                message: 'Vehicle not found'
            });
        }

        const lastPing = await LocationPing.findOne({ vehicle: req.params.id })
            .sort({ recordedAt: -1 });

        if (!lastPing) {
            return res.status(404).json({
                error: true,
                message: 'No location data found for this vehicle'
            });
        }

        res.status(200).json({
            error: false,
            data: {
                vehicle: {
                    id: vehicle._id,
                    registrationNumber: vehicle.registrationNumber,
                    make: vehicle.make,
                    model: vehicle.model,
                    status: vehicle.status
                },
                lastLocation: {
                    latitude: lastPing.location.coordinates[1],
                    longitude: lastPing.location.coordinates[0],
                    speed: lastPing.speed,
                    heading: lastPing.heading,
                    recordedAt: lastPing.recordedAt
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

const getLocationHistory = async (req, res, next) => {
    try {
        const { from, to, page, limit } = req.query;

        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({
                error: true,
                message: 'Vehicle not found'
            });
        }

        let filter = { vehicle: req.params.id };

        if (from || to) {
            filter.recordedAt = {};
            if (from) filter.recordedAt.$gte = new Date(from);
            if (to) filter.recordedAt.$lte = new Date(to);
        }

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 50;
        const skip = (pageNum - 1) * limitNum;

        const pings = await LocationPing.find(filter)
            .sort({ recordedAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await LocationPing.countDocuments(filter);

        const formattedPings = pings.map(p => ({
            latitude: p.location.coordinates[1],
            longitude: p.location.coordinates[0],
            speed: p.speed,
            heading: p.heading,
            recordedAt: p.recordedAt
        }));

        res.status(200).json({
            error: false,
            count: formattedPings.length,
            total: total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            vehicle: {
                id: vehicle._id,
                registrationNumber: vehicle.registrationNumber
            },
            data: formattedPings
        });
    } catch (error) {
        next(error);
    }
};

const getLiveLocations = async (req, res, next) => {
    try {
        const { district, province } = req.query;

        let vehicleFilter = { status: 'active' };
        if (district) vehicleFilter.district = district;

        let vehicles = await Vehicle.find(vehicleFilter)
            .populate({
                path: 'district',
                select: 'name code province',
                populate: { path: 'province', select: 'name code' }
            })
            .select('_id registrationNumber make model district');

        if (province) {
            vehicles = vehicles.filter(v =>
                v.district && v.district.province && v.district.province._id.toString() === province
            );
        }

        const vehicleIds = vehicles.map(v => v._id);

        const lastPings = await LocationPing.aggregate([
            { $match: { vehicle: { $in: vehicleIds } } },
            { $sort: { vehicle: 1, recordedAt: -1 } },
            {
                $group: {
                    _id: '$vehicle',
                    lastPing: { $first: '$$ROOT' }
                }
            }
        ]);

        const pingMap = {};
        lastPings.forEach(p => {
            pingMap[p._id.toString()] = p.lastPing;
        });

        const liveData = vehicles.map(v => {
            const ping = pingMap[v._id.toString()];
            return {
                vehicle: {
                    id: v._id,
                    registrationNumber: v.registrationNumber,
                    make: v.make,
                    model: v.model,
                    district: v.district
                },
                lastLocation: ping ? {
                    latitude: ping.location.coordinates[1],
                    longitude: ping.location.coordinates[0],
                    speed: ping.speed,
                    heading: ping.heading,
                    recordedAt: ping.recordedAt
                } : null
            };
        });

        res.status(200).json({
            error: false,
            count: liveData.length,
            data: liveData
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createLocationPing,
    createBulkPings,
    getLastLocation,
    getLocationHistory,
    getLiveLocations
};
