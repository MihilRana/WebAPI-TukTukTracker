const PoliceStation = require('../models/PoliceStation');

const getAllStations = async (req, res, next) => {
    try {
        const { district, province, sort, order, page, limit } = req.query;

        let filter = {};
        if (district) {
            filter.district = district;
        }

        let sortOption = { name: 1 };
        if (sort) {
            sortOption = { [sort]: order === 'desc' ? -1 : 1 };
        }

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;
        const skip = (pageNum - 1) * limitNum;

        let query = PoliceStation.find(filter)
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

        if (province) {
            const stations = await PoliceStation.find(filter)
                .populate({
                    path: 'district',
                    select: 'name code province',
                    match: {},
                    populate: {
                        path: 'province',
                        select: 'name code'
                    }
                })
                .sort(sortOption);

            const filtered = stations.filter(s =>
                s.district && s.district.province && s.district.province._id.toString() === province
            );

            const paginated = filtered.slice(skip, skip + limitNum);
            const total = filtered.length;

            return res.status(200).json({
                error: false,
                count: paginated.length,
                total: total,
                page: pageNum,
                totalPages: Math.ceil(total / limitNum),
                data: paginated
            });
        }

        const stations = await query;
        const total = await PoliceStation.countDocuments(filter);

        res.status(200).json({
            error: false,
            count: stations.length,
            total: total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            data: stations
        });
    } catch (error) {
        next(error);
    }
};

const getStationById = async (req, res, next) => {
    try {
        const station = await PoliceStation.findById(req.params.id)
            .populate({
                path: 'district',
                select: 'name code province',
                populate: {
                    path: 'province',
                    select: 'name code'
                }
            });

        if (!station) {
            return res.status(404).json({
                error: true,
                message: 'Police station not found'
            });
        }

        res.status(200).json({
            error: false,
            data: station
        });
    } catch (error) {
        next(error);
    }
};

const createStation = async (req, res, next) => {
    try {
        const { name, district, contactNumber, address } = req.body;

        if (!name || !district) {
            return res.status(400).json({
                error: true,
                message: 'Name and district are required'
            });
        }

        const station = await PoliceStation.create({ name, district, contactNumber, address });
        await station.populate({
            path: 'district',
            select: 'name code province',
            populate: {
                path: 'province',
                select: 'name code'
            }
        });

        res.status(201).json({
            error: false,
            message: 'Police station created successfully',
            data: station
        });
    } catch (error) {
        next(error);
    }
};

const updateStation = async (req, res, next) => {
    try {
        const { name, district, contactNumber, address } = req.body;

        const station = await PoliceStation.findById(req.params.id);
        if (!station) {
            return res.status(404).json({
                error: true,
                message: 'Police station not found'
            });
        }

        if (name) station.name = name;
        if (district) station.district = district;
        if (contactNumber) station.contactNumber = contactNumber;
        if (address) station.address = address;

        await station.save();
        await station.populate({
            path: 'district',
            select: 'name code province',
            populate: {
                path: 'province',
                select: 'name code'
            }
        });

        res.status(200).json({
            error: false,
            message: 'Police station updated successfully',
            data: station
        });
    } catch (error) {
        next(error);
    }
};

const deleteStation = async (req, res, next) => {
    try {
        const station = await PoliceStation.findById(req.params.id);
        if (!station) {
            return res.status(404).json({
                error: true,
                message: 'Police station not found'
            });
        }

        await PoliceStation.findByIdAndDelete(req.params.id);

        res.status(200).json({
            error: false,
            message: 'Police station deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllStations,
    getStationById,
    createStation,
    updateStation,
    deleteStation
};