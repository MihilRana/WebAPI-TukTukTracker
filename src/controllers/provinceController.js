const Province = require('../models/Province');
const District = require('../models/District');

const getAllProvinces = async (req, res, next) => {
    try {
        const { sort, order } = req.query;

        let sortOption = { name: 1 };
        if (sort) {
            sortOption = { [sort]: order === 'desc' ? -1 : 1 };
        }

        const provinces = await Province.find().sort(sortOption);

        res.status(200).json({
            error: false,
            count: provinces.length,
            data: provinces
        });
    } catch (error) {
        next(error);
    }
};

const getProvinceById = async (req, res, next) => {
    try {
        const province = await Province.findById(req.params.id);

        if (!province) {
            return res.status(404).json({
                error: true,
                message: 'Province not found'
            });
        }

        res.status(200).json({
            error: false,
            data: province
        });
    } catch (error) {
        next(error);
    }
};

const createProvince = async (req, res, next) => {
    try {
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                error: true,
                message: 'Name and code are required'
            });
        }

        const existing = await Province.findOne({
            $or: [{ name }, { code: code.toUpperCase() }]
        });

        if (existing) {
            return res.status(409).json({
                error: true,
                message: 'Province with this name or code already exists'
            });
        }

        const province = await Province.create({ name, code });

        res.status(201).json({
            error: false,
            message: 'Province created successfully',
            data: province
        });
    } catch (error) {
        next(error);
    }
};

const updateProvince = async (req, res, next) => {
    try {
        const { name, code } = req.body;

        const province = await Province.findById(req.params.id);
        if (!province) {
            return res.status(404).json({
                error: true,
                message: 'Province not found'
            });
        }

        if (name) province.name = name;
        if (code) province.code = code;

        await province.save();

        res.status(200).json({
            error: false,
            message: 'Province updated successfully',
            data: province
        });
    } catch (error) {
        next(error);
    }
};

const deleteProvince = async (req, res, next) => {
    try {
        const province = await Province.findById(req.params.id);
        if (!province) {
            return res.status(404).json({
                error: true,
                message: 'Province not found'
            });
        }

        const districtCount = await District.countDocuments({ province: req.params.id });
        if (districtCount > 0) {
            return res.status(400).json({
                error: true,
                message: `Cannot delete province. It has ${districtCount} districts linked to it.`
            });
        }

        await Province.findByIdAndDelete(req.params.id);

        res.status(200).json({
            error: false,
            message: 'Province deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

const getDistrictsByProvince = async (req, res, next) => {
    try {
        const province = await Province.findById(req.params.id);
        if (!province) {
            return res.status(404).json({
                error: true,
                message: 'Province not found'
            });
        }

        const districts = await District.find({ province: req.params.id }).sort({ name: 1 });

        res.status(200).json({
            error: false,
            count: districts.length,
            data: districts
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProvinces,
    getProvinceById,
    createProvince,
    updateProvince,
    deleteProvince,
    getDistrictsByProvince
};