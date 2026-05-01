require('dotenv').config();
const mongoose = require('mongoose');
const Province = require('../models/Province');
const District = require('../models/District');
const PoliceStation = require('../models/PoliceStation');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const {
    provinces,
    districts,
    policeStations,
    firstNames,
    lastNames,
    vehicleMakes,
    colors
} = require('./masterData');

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateNIC() {
    const year = Math.floor(Math.random() * 30) + 1970;
    const days = Math.floor(Math.random() * 365) + 1;
    const serial = Math.floor(Math.random() * 9000) + 1000;
  return `${year}${String(days).padStart(3, '0')}${serial}V`;
}

function generateLicense() {
    const prefix = 'B';
    const number = Math.floor(Math.random() * 9000000) + 1000000;
    return `${prefix}${number}`;
}

function generatePhone() {
    const prefixes = ['071', '072', '075', '076', '077', '078'];
    const number = Math.floor(Math.random() * 9000000) + 1000000;
    return `${getRandomItem(prefixes)}${number}`;
}

function generateRegNumber(index) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const prefix = letters[Math.floor(index / 26)] + letters[index % 26];
    const number = String(index + 1000).padStart(4, '0');
    return `WP-${prefix}-${number}`;
}

const seedAll = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Province.deleteMany({});
        await District.deleteMany({});
        await PoliceStation.deleteMany({});
        await Driver.deleteMany({});
        await Vehicle.deleteMany({});
        console.log('Cleared all collections');

        const createdProvinces = await Province.insertMany(provinces);
        console.log(`Seeded ${createdProvinces.length} provinces`);

        const provinceMap = {};
        createdProvinces.forEach(p => {
            provinceMap[p.name] = p._id;
        });

        const districtsWithRefs = districts.map(d => ({
            name: d.name,
            code: d.code,
            province: provinceMap[d.provinceName]
        }));
        const createdDistricts = await District.insertMany(districtsWithRefs);
        console.log(`Seeded ${createdDistricts.length} districts`);

        const districtMap = {};
        createdDistricts.forEach(d => {
            districtMap[d.name] = d._id;
        });

        const stationsWithRefs = policeStations.map(s => ({
            name: s.name,
            district: districtMap[s.districtName],
            contactNumber: s.contactNumber,
            address: s.address
        }));

        const createdStations = await PoliceStation.insertMany(stationsWithRefs);
        console.log(`Seeded ${createdStations.length} police stations`);

        const districtIds = createdDistricts.map(d => d._id);
        const drivers = [];
        const vehicles = [];

        for (let i = 0; i < 200; i++) {
            const districtId = districtIds[i % districtIds.length];
            const firstName = getRandomItem(firstNames);
            const lastName = getRandomItem(lastNames);

            const driver = {
                firstName: firstName,
                lastName: lastName,
                nicNumber: generateNIC(),
                licenseNumber: generateLicense(),
                phone: generatePhone(),
                district: districtId,
                status: Math.random() > 0.1 ? 'active' : 'inactive'
            };
            drivers.push(driver);
        }

        const createdDrivers = await Driver.insertMany(drivers);
        console.log(`Seeded ${createdDrivers.length} drivers`);

        for (let i = 0; i < 200; i++) {
            const vehicleType = getRandomItem(vehicleMakes);
            const vehicle = {
                registrationNumber: generateRegNumber(i),
                driver: createdDrivers[i]._id,
                district: createdDrivers[i].district,
                make: vehicleType.make,
                model: vehicleType.model,
                year: getRandomItem(vehicleType.years),
                color: getRandomItem(colors),
                status: createdDrivers[i].status === 'active' ? 'active' : 'inactive'
            };
            vehicles.push(vehicle);
        }

        const createdVehicles = await Vehicle.insertMany(vehicles);
        console.log(`Seeded ${createdVehicles.length} vehicles`);

        console.log('\nSeeding complete! Summary:');
        console.log(`  Provinces: ${createdProvinces.length}`);
        console.log(`  Districts: ${createdDistricts.length}`);
        console.log(`  Police Stations: ${createdStations.length}`);
        console.log(`  Drivers: ${createdDrivers.length}`);
        console.log(`  Vehicles: ${createdVehicles.length}`);

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error.message);
        process.exit(1);
    }
};

seedAll();
