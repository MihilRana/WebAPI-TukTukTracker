require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const LocationPing = require('../models/LocationPing');

const SRI_LANKA_BOUNDS = {
    minLat: 5.92,
    maxLat: 9.84,
    minLng: 79.52,
    maxLng: 81.88
};

const CITY_CENTERS = [
    { name: 'Colombo', lat: 6.9271, lng: 79.8612 },
    { name: 'Kandy', lat: 7.2906, lng: 80.6337 },
    { name: 'Galle', lat: 6.0535, lng: 80.2210 },
    { name: 'Jaffna', lat: 9.6615, lng: 80.0255 },
    { name: 'Negombo', lat: 7.2008, lng: 79.8737 },
    { name: 'Trincomalee', lat: 8.5874, lng: 81.2152 },
    { name: 'Batticaloa', lat: 7.7310, lng: 81.6747 },
    { name: 'Anuradhapura', lat: 8.3114, lng: 80.4037 },
    { name: 'Matara', lat: 5.9549, lng: 80.5550 },
    { name: 'Kurunegala', lat: 7.4863, lng: 80.3647 },
    { name: 'Ratnapura', lat: 6.6828, lng: 80.3992 },
    { name: 'Badulla', lat: 6.9934, lng: 81.0550 },
    { name: 'Nuwara Eliya', lat: 6.9497, lng: 80.7891 },
    { name: 'Kegalle', lat: 7.2513, lng: 80.3464 },
    { name: 'Hambantota', lat: 6.1429, lng: 81.1212 },
    { name: 'Puttalam', lat: 8.0362, lng: 79.8283 },
    { name: 'Matale', lat: 7.4675, lng: 80.6234 },
    { name: 'Ampara', lat: 7.2976, lng: 81.6720 },
    { name: 'Polonnaruwa', lat: 7.9403, lng: 81.0188 },
    { name: 'Monaragala', lat: 6.8728, lng: 81.3507 }
];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function clampLat(lat) {
    return Math.max(SRI_LANKA_BOUNDS.minLat, Math.min(SRI_LANKA_BOUNDS.maxLat, lat));
}

function clampLng(lng) {
    return Math.max(SRI_LANKA_BOUNDS.minLng, Math.min(SRI_LANKA_BOUNDS.maxLng, lng));
}

function generateDayPings(vehicleId, date, startLat, startLng) {
    const pings = [];
    let currentLat = startLat;
    let currentLng = startLng;

    const startHour = 6 + Math.floor(Math.random() * 3);
    const endHour = 19 + Math.floor(Math.random() * 4);

    for (let h = startHour; h <= endHour; h++) {
        const pingsThisHour = Math.floor(Math.random() * 4) + 1;

        for (let p = 0; p < pingsThisHour; p++) {
            const minute = Math.floor(Math.random() * 60);
            const second = Math.floor(Math.random() * 60);

            const latChange = (Math.random() - 0.5) * 0.01;
            const lngChange = (Math.random() - 0.5) * 0.01;
            currentLat = clampLat(currentLat + latChange);
            currentLng = clampLng(currentLng + lngChange);

            const speed = Math.random() * 45 + 5;
            const heading = Math.floor(Math.random() * 360);

            const pingTime = new Date(date);
            pingTime.setHours(h, minute, second, 0);

            pings.push({
                vehicle: vehicleId,
                location: {
                    type: 'Point',
                    coordinates: [currentLng, currentLat]
                },
                speed: Math.round(speed * 10) / 10,
                heading: heading,
                recordedAt: pingTime
            });
        }
    }

    return { pings, lastLat: currentLat, lastLng: currentLng };
}

const seedLocations = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await LocationPing.deleteMany({});
        console.log('Cleared existing location pings');

        const vehicles = await Vehicle.find({ status: 'active' });
        console.log(`Found ${vehicles.length} active vehicles`);

        const DAYS_BACK = 8;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let totalPings = 0;
        const batchSize = 20;

        for (let i = 0; i < vehicles.length; i += batchSize) {
            const batch = vehicles.slice(i, i + batchSize);
            let allPings = [];

            for (const vehicle of batch) {
                const baseCity = getRandomItem(CITY_CENTERS);
                let currentLat = baseCity.lat + (Math.random() - 0.5) * 0.05;
                let currentLng = baseCity.lng + (Math.random() - 0.5) * 0.05;

                for (let d = DAYS_BACK; d >= 0; d--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - d);

                    if (Math.random() < 0.15) continue;

                    const result = generateDayPings(vehicle._id, date, currentLat, currentLng);
                    allPings = allPings.concat(result.pings);
                    currentLat = result.lastLat;
                    currentLng = result.lastLng;
                }
            }

            if (allPings.length > 0) {
                await LocationPing.insertMany(allPings);
                totalPings += allPings.length;
            }

            console.log(`Progress: ${Math.min(i + batchSize, vehicles.length)}/${vehicles.length} vehicles processed (${totalPings} pings so far)`);
        }

        console.log(`\nLocation seeding complete!`);
        console.log(`Total pings generated: ${totalPings}`);
        console.log(`Vehicles covered: ${vehicles.length}`);
        console.log(`Days covered: ${DAYS_BACK + 1}`);

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error.message);
        process.exit(1);
    }
};

seedLocations();
