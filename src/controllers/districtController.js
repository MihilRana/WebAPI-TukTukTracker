const District = require('../models/District');
const PoliceStation = require('../models/PoliceStation');
const Vehicle = require('../models/Vehicle');

const getAllDistricts = async (req, res, next) => {
    try {
        const { province, sort, order } = req.query;

        let filter = {};
        if (province) {
            filter.province = province;
        }

        let sortOption = { name: 1 };
        if (sort) {
            sortOption = { [sort]: order === 'desc' ? -1 : 1 };
        }

        const districts = await District.find(filter)
            .populate('province', 'name code')
            .sort(sortOption);

        res.status(200).json({
            error: false,
            count: districts.length,
            data: districts
        });
    } catch (error) {
        next(error);
    }
};

const getDistrictById = async (req, res, next) => {
    try {
        const district = await District.findById(req.params.id)
            .populate('province', 'name code');

        if (!district) {
            return res.status(404).json({
                error: true,
                message: 'District not found'
            });
        }

        res.status(200).json({
            error: false,
            data: district
        });
    } catch (error) {
        next(error);
    }
};

const createDistrict = async (req, res, next) => {
    try {
        const { name, code, province } = req.body;

        if (!name || !code || !province) {
            return res.status(400).json({
                error: true,
                message: 'Name, code, and province are required'
            });
        }

        const existing = await District.findOne({ code: code.toUpperCase() });
        if (existing) {
            return res.status(409).json({
                error: true,
                message: 'District with this code already exists'
            });
        }

        const district = await District.create({ name, code, province });
        await district.populate('province', 'name code');

        res.status(201).json({
            error: false,
            message: 'District created successfully',
            data: district
        });
    } catch (error) {
        next(error);
    }
};

const updateDistrict = async (req, res, next) => {
    try {
        const { name, code, province } = req.body;

        const district = await District.findById(req.params.id);
        if (!district) {
            return res.status(404).json({
                error: true,
                message: 'District not found'
            });
        }

        if (name) district.name = name;
        if (code) district.code = code;
        if (province) district.province = province;

        await district.save();
        await district.populate('province', 'name code');

        res.status(200).json({
            error: false,
            message: 'District updated successfully',
            data: district
        });
    } catch (error) {
        next(error);
    }
};

const deleteDistrict = async (req, res, next) => {
    try {
        const district = await District.findById(req.params.id);
        if (!district) {
            return res.status(404).json({
                error: true,
                message: 'District not found'
            });
        }

        const stationCount = await PoliceStation.countDocuments({ district: req.params.id });
        const vehicleCount = await Vehicle.countDocuments({ district: req.params.id });

        if (stationCount > 0 || vehicleCount > 0) {
            return res.status(400).json({
                error: true,
                message: `Cannot delete district. It has ${stationCount} police stations and ${vehicleCount} vehicles linked to it.`
            });
        }

        await District.findByIdAndDelete(req.params.id);

        res.status(200).json({
            error: false,
            message: 'District deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllDistricts,
    getDistrictById,
    createDistrict,
    updateDistrict,
    deleteDistrict
};
