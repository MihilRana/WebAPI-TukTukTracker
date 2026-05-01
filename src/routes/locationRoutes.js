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

/**
 * @swagger
 * tags:
 *   name: Location Tracking
 *   description: GPS location ping and tracking endpoints
 */

/**
 * @swagger
 * /api/locations/ping:
 *   post:
 *     summary: Send a single location ping (operator or superadmin)
 *     tags: [Location Tracking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleId
 *               - latitude
 *               - longitude
 *             properties:
 *               vehicleId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439015
 *               latitude:
 *                 type: number
 *                 example: 6.9271
 *               longitude:
 *                 type: number
 *                 example: 79.8612
 *               speed:
 *                 type: number
 *                 example: 25.5
 *               heading:
 *                 type: number
 *                 example: 180
 *     responses:
 *       201:
 *         description: Location ping recorded
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Vehicle not found
 */
router.post(
    '/ping',
    authorize('operator', 'superadmin'),
    pingLimiter,
    validateLocationPing,
    createLocationPing
);

/**
 * @swagger
 * /api/locations/ping/bulk:
 *   post:
 *     summary: Send multiple location pings in batch (max 100)
 *     tags: [Location Tracking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pings
 *             properties:
 *               pings:
 *                 type: array
 *                 maxItems: 100
 *                 items:
 *                   type: object
 *                   properties:
 *                     vehicleId:
 *                       type: string
 *                     latitude:
 *                       type: number
 *                     longitude:
 *                       type: number
 *                     speed:
 *                       type: number
 *                     heading:
 *                       type: number
 *                     recordedAt:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       201:
 *         description: Pings recorded with success and failure counts
 *       400:
 *         description: Invalid input
 */
router.post(
    '/ping/bulk',
    authorize('operator', 'superadmin'),
    pingLimiter,
    createBulkPings
);

/**
 * @swagger
 * /api/locations/live:
 *   get:
 *     summary: Get last known location of all active vehicles
 *     tags: [Location Tracking]
 *     parameters:
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: Filter by district ID
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: Filter by province ID
 *     responses:
 *       200:
 *         description: Live location data for all active vehicles
 */
router.get('/live', getLiveLocations);

/**
 * @swagger
 * /api/locations/vehicle/{id}/last:
 *   get:
 *     summary: Get the last known location of a specific vehicle
 *     tags: [Location Tracking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Last known location
 *       404:
 *         description: Vehicle or location not found
 */
router.get('/vehicle/:id/last', getLastLocation);

/**
 * @swagger
 * /api/locations/vehicle/{id}/history:
 *   get:
 *     summary: Get location history of a vehicle
 *     tags: [Location Tracking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date (e.g. 2026-04-20)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date (e.g. 2026-04-28)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Paginated location history
 *       404:
 *         description: Vehicle not found
 */
router.get('/vehicle/:id/history', getLocationHistory);

module.exports = router;