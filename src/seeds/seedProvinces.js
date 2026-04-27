require('dotenv').config();
const mongoose = require('mongoose');
const Province = require('../models/Province');
const District = require('../models/District');
const { provinces, districts } = require('./masterData');

const seedProvincesAndDistricts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Province.deleteMany({});
        await District.deleteMany({});
        console.log('Cleared existing provinces and districts');

        const createdProvinces = await Province.insertMany(provinces);
        console.log('Seeded ' + createdProvinces.length + ' provinces');

        const provinceMap = {};
        createdProvinces.forEach(function(prov) {
            provinceMap[prov.name] = prov._id;
        });

        const districtsWithRefs = [];
        for (let i = 0; i < districts.length; i++) {
            districtsWithRefs.push({
                name: districts[i].name,
                code: districts[i].code,
                province: provinceMap[districts[i].provinceName]
            });
        }

        const createdDistricts = await District.insertMany(districtsWithRefs);
        console.log('Seeded ' + createdDistricts.length + ' districts');

        console.log('Province and district seeding complete');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error.message);
        process.exit(1);
    }
};

seedProvincesAndDistricts();