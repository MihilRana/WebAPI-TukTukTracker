const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');

const getAllDrivers = async (req, res, next) => {
    try {
        const { district, status, search, sort, order, page, limit } = req.query;

        let filter = {};
        if (district) filter.district = district;
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { nicNumber: { $regex: search, $options: 'i' } },
                { licenseNumber: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        let sortOption = { firstName: 1 };
        if (sort) {
            sortOption = { [sort]: order === 'desc' ? -1 : 1 };
        }

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;
        const skip = (pageNum - 1) * limitNum;

        const drivers = await Driver.find(filter)
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

        const total = await Driver.countDocuments(filter);

        res.status(200).json({
            error: false,
            count: drivers.length,
            total: total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            data: drivers
        });
    } catch (error) {
        next(error);
    }
};

const getDriverById = async (req, res, next) => {
    try {
        const driver = await Driver.findById(req.params.id)
            .populate({
                path: 'district',
                select: 'name code province',
                populate: {
                    path: 'province',
                    select: 'name code'
                }
            });

        if (!driver) {
            return res.status(404).json({
                error: true,
                message: 'Driver not found'
            });
        }

        const vehicle = await Vehicle.findOne({ driver: req.params.id })
            .select('registrationNumber make model year color status');

        res.status(200).json({
            error: false,
            data: {
                ...driver.toObject(),
                vehicle: vehicle || null
            }
        });
    } catch (error) {
        next(error);
    }
};

const createDriver = async (req, res, next) => {
    try {
        const { firstName, lastName, nicNumber, licenseNumber, phone, district } = req.body;

        if (!firstName || !lastName || !nicNumber || !licenseNumber || !phone || !district) {
            return res.status(400).json({
                error: true,
                message: 'First name, last name, NIC number, license number, phone, and district are required'
            });
        }

        const existingNIC = await Driver.findOne({ nicNumber });
        if (existingNIC) {
            return res.status(409).json({
                error: true,
                message: 'Driver with this NIC number already exists'
            });
        }

        const existingLicense = await Driver.findOne({ licenseNumber });
        if (existingLicense) {
            return res.status(409).json({
                error: true,
                message: 'Driver with this license number already exists'
            });
        }

        const driver = await Driver.create({
            firstName, lastName, nicNumber, licenseNumber, phone, district
        });

        await driver.populate({
            path: 'district',
            select: 'name code province',
            populate: { path: 'province', select: 'name code' }
        });

        res.status(201).json({
            error: false,
            message: 'Driver created successfully',
            data: driver
        });
    } catch (error) {
        next(error);
    }
};

const updateDriver = async (req, res, next) => {
    try {
        const { firstName, lastName, nicNumber, licenseNumber, phone, district, status } = req.body;

        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({
                error: true,
                message: 'Driver not found'
            });
        }

        if (nicNumber && nicNumber !== driver.nicNumber) {
            const existingNIC = await Driver.findOne({ nicNumber });
            if (existingNIC) {
                return res.status(409).json({
                    error: true,
                    message: 'Another driver with this NIC number already exists'
                });
            }
        }

        if (licenseNumber && licenseNumber !== driver.licenseNumber) {
            const existingLicense = await Driver.findOne({ licenseNumber });
            if (existingLicense) {
                return res.status(409).json({
                    error: true,
                    message: 'Another driver with this license number already exists'
                });
            }
        }

        if (firstName) driver.firstName = firstName;
        if (lastName) driver.lastName = lastName;
        if (nicNumber) driver.nicNumber = nicNumber;
        if (licenseNumber) driver.licenseNumber = licenseNumber;
        if (phone) driver.phone = phone;
        if (district) driver.district = district;
        if (status) driver.status = status;

        await driver.save();
        await driver.populate({
            path: 'district',
            select: 'name code province',
            populate: { path: 'province', select: 'name code' }
        });

        res.status(200).json({
            error: false,
            message: 'Driver updated successfully',
            data: driver
        });
    } catch (error) {
        next(error);
    }
};

const deleteDriver = async (req, res, next) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({
                error: true,
                message: 'Driver not found'
            });
        }

        const vehicle = await Vehicle.findOne({ driver: req.params.id });
        if (vehicle) {
            return res.status(400).json({
                error: true,
                message: `Cannot delete driver. They are linked to vehicle ${vehicle.registrationNumber}.`
            });
        }

        await Driver.findByIdAndDelete(req.params.id);

        res.status(200).json({
            error: false,
            message: 'Driver deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver
};