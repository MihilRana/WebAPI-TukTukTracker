const Vehicle = require('../models/Vehicle');

const getAllVehicles = async (req, res, next) => {
    try {
        const { district, province, status, make, sort, order, page, limit, search } = req.query;

        let filter = {};
        if (district) filter.district = district;
        if (status) filter.status = status;
        if (make) filter.make = { $regex: make, $options: 'i' };
        if (search) {
            filter.registrationNumber = { $regex: search, $options: 'i' };
        }

        let sortOption = { registrationNumber: 1 };
        if (sort) {
            sortOption = { [sort]: order === 'desc' ? -1 : 1 };
        }

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;
        const skip = (pageNum - 1) * limitNum;

        let vehicles;
        let total;

        if (province) {
            const allVehicles = await Vehicle.find(filter)
                .populate('driver', 'firstName lastName nicNumber phone')
                .populate({
                    path: 'district',
                    select: 'name code province',
                    populate: {
                        path: 'province',
                        select: 'name code'
                    }
                })
                .sort(sortOption);

            const filtered = allVehicles.filter(v =>
                v.district && v.district.province && v.district.province._id.toString() === province
            );

            total = filtered.length;
            vehicles = filtered.slice(skip, skip + limitNum);
        } else {
            vehicles = await Vehicle.find(filter)
                .populate('driver', 'firstName lastName nicNumber phone')
                .populate({
                    path: 'district',
                    select: 'name code province',
                    populate: {
                        path: 'province',
                        select: 'name code'
                    }
                })
                .sort(sortOption)
                .skip(skip)
                .limit(limitNum);

            total = await Vehicle.countDocuments(filter);
        }

        res.status(200).json({
            error: false,
            count: vehicles.length,
            total: total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            data: vehicles
        });
    } catch (error) {
        next(error);
    }
};

const getVehicleById = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id)
            .populate('driver', 'firstName lastName nicNumber phone licenseNumber')
            .populate({
                path: 'district',
                select: 'name code province',
                populate: {
                    path: 'province',
                    select: 'name code'
                }
            });

        if (!vehicle) {
            return res.status(404).json({
                error: true,
                message: 'Vehicle not found'
            });
        }

        res.status(200).json({
            error: false,
            data: vehicle
        });
    } catch (error) {
        next(error);
    }
};

const createVehicle = async (req, res, next) => {
    try {
        const { registrationNumber, driver, district, make, model, year, color } = req.body;

        if (!registrationNumber || !driver || !district) {
            return res.status(400).json({
                error: true,
                message: 'Registration number, driver, and district are required'
            });
        }

        const existing = await Vehicle.findOne({ registrationNumber: registrationNumber.toUpperCase() });
        if (existing) {
            return res.status(409).json({
                error: true,
                message: 'Vehicle with this registration number already exists'
            });
        }

        const vehicle = await Vehicle.create({
            registrationNumber, driver, district, make, model, year, color
        });

        await vehicle.populate('driver', 'firstName lastName nicNumber phone');
        await vehicle.populate({
            path: 'district',
            select: 'name code province',
            populate: { path: 'province', select: 'name code' }
        });

        res.status(201).json({
            error: false,
            message: 'Vehicle registered successfully',
            data: vehicle
        });
    } catch (error) {
        next(error);
    }
};

const updateVehicle = async (req, res, next) => {
    try {
        const { registrationNumber, driver, district, make, model, year, color, status } = req.body;

        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({
                error: true,
                message: 'Vehicle not found'
            });
        }

        if (registrationNumber) vehicle.registrationNumber = registrationNumber;
        if (driver) vehicle.driver = driver;
        if (district) vehicle.district = district;
        if (make) vehicle.make = make;
        if (model) vehicle.model = model;
        if (year) vehicle.year = year;
        if (color) vehicle.color = color;
        if (status) vehicle.status = status;

        await vehicle.save();
        await vehicle.populate('driver', 'firstName lastName nicNumber phone');
        await vehicle.populate({
            path: 'district',
            select: 'name code province',
            populate: { path: 'province', select: 'name code' }
        });

        res.status(200).json({
            error: false,
            message: 'Vehicle updated successfully',
            data: vehicle
        });
    } catch (error) {
        next(error);
    }
};

const deleteVehicle = async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({
                error: true,
                message: 'Vehicle not found'
            });
        }

        await Vehicle.findByIdAndDelete(req.params.id);

        res.status(200).json({
            error: false,
            message: 'Vehicle deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
};
