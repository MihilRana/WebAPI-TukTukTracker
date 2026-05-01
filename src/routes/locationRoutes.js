const express = require('express');
const router = express.Router();
const {
    createLocationPing,
    createBulkPings,
    getLastLocation,
    getLocationHistory,
    getLiveLocations
} = require('../controllers/locationController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.post(
    '/ping',
    authorize('operator', 'superadmin'),
    createLocationPing
);

router.post(
    '/ping/bulk',
    authorize('operator', 'superadmin'),
    createBulkPings
);

router.get('/live', getLiveLocations);

router.get(
    '/vehicle/:id/last',
    getLastLocation
);

router.get(
    '/vehicle/:id/history',
    getLocationHistory
);

module.exports = router;