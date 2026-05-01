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
const { pingLimiter } = require('../middleware/rateLimiter');
const { validateLocationPing } = require('../middleware/validate');

router.use(authenticate);

router.post(
    '/ping',
    authorize('operator', 'superadmin'),
    pingLimiter,
    validateLocationPing,
    createLocationPing
);

router.post(
    '/ping/bulk',
    authorize('operator', 'superadmin'),
    pingLimiter,
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