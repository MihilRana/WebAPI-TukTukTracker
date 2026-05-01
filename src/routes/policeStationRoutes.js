const express = require('express');
const router = express.Router();
const {
    getAllStations,
    getStationById,
    createStation,
    updateStation,
    deleteStation
} = require('../controllers/policeStationController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Police Stations
 *   description: Police station management endpoints
 */

/**
 * @swagger
 * /api/stations:
 *   get:
 *     summary: Get all police stations
 *     tags: [Police Stations]
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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Paginated list of police stations
 */
router.get('/', getAllStations);

/**
 * @swagger
 * /api/stations/{id}:
 *   get:
 *     summary: Get a police station by ID
 *     tags: [Police Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Police station data
 *       404:
 *         description: Police station not found
 */
router.get('/:id', getStationById);

/**
 * @swagger
 * /api/stations:
 *   post:
 *     summary: Create a police station
 *     tags: [Police Stations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - district
 *             properties:
 *               name:
 *                 type: string
 *                 example: Colombo Fort Police Station
 *               district:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *               contactNumber:
 *                 type: string
 *                 example: 011-2421111
 *               address:
 *                 type: string
 *                 example: Fort, Colombo 01
 *     responses:
 *       201:
 *         description: Police station created
 *       400:
 *         description: Missing required fields
 */
router.post('/', authorize('superadmin', 'provincial_admin'), createStation);

/**
 * @swagger
 * /api/stations/{id}:
 *   put:
 *     summary: Update a police station
 *     tags: [Police Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               district:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Police station updated
 *       404:
 *         description: Police station not found
 */
router.put('/:id', authorize('superadmin', 'provincial_admin'), updateStation);

/**
 * @swagger
 * /api/stations/{id}:
 *   delete:
 *     summary: Delete a police station (superadmin only)
 *     tags: [Police Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Police station deleted
 *       404:
 *         description: Police station not found
 */
router.delete('/:id', authorize('superadmin'), deleteStation);

module.exports = router;
