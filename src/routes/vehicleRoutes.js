const express = require('express');
const router = express.Router();
const {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
} = require('../controllers/vehicleController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management endpoints
 */

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, deregistered]
 *       - in: query
 *         name: make
 *         schema:
 *           type: string
 *         description: Filter by vehicle make (e.g. Bajaj)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by registration number
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
 *         description: Paginated list of vehicles
 */
router.get('/', getAllVehicles);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Get a vehicle by ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle data with driver info
 *       404:
 *         description: Vehicle not found
 */
router.get('/:id', getVehicleById);

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Register a new vehicle
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registrationNumber
 *               - driver
 *               - district
 *             properties:
 *               registrationNumber:
 *                 type: string
 *                 example: WP-AB-1234
 *               driver:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439014
 *               district:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *               make:
 *                 type: string
 *                 example: Bajaj
 *               model:
 *                 type: string
 *                 example: RE Compact
 *               year:
 *                 type: number
 *                 example: 2022
 *               color:
 *                 type: string
 *                 example: Red
 *     responses:
 *       201:
 *         description: Vehicle registered
 *       409:
 *         description: Registration number already exists
 */
router.post('/', authorize('superadmin', 'provincial_admin', 'district_officer'), createVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
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
 *               registrationNumber:
 *                 type: string
 *               driver:
 *                 type: string
 *               district:
 *                 type: string
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: number
 *               color:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, deregistered]
 *     responses:
 *       200:
 *         description: Vehicle updated
 *       404:
 *         description: Vehicle not found
 */
router.put('/:id', authorize('superadmin', 'provincial_admin', 'district_officer'), updateVehicle);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle deleted
 *       404:
 *         description: Vehicle not found
 */
router.delete('/:id', authorize('superadmin', 'provincial_admin'), deleteVehicle);

module.exports = router;
