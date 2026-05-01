const express = require('express');
const router = express.Router();
const {
    getAllDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver
} = require('../controllers/driverController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Drivers
 *   description: Driver management endpoints
 */

/**
 * @swagger
 * /api/drivers:
 *   get:
 *     summary: Get all drivers
 *     tags: [Drivers]
 *     parameters:
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: Filter by district ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, suspended]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, NIC, license, or phone
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
 *         description: Paginated list of drivers
 */
router.get('/', getAllDrivers);

/**
 * @swagger
 * /api/drivers/{id}:
 *   get:
 *     summary: Get a driver by ID with linked vehicle
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Driver data with vehicle info
 *       404:
 *         description: Driver not found
 */
router.get('/:id', getDriverById);

/**
 * @swagger
 * /api/drivers:
 *   post:
 *     summary: Create a new driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - nicNumber
 *               - licenseNumber
 *               - phone
 *               - district
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Kamal
 *               lastName:
 *                 type: string
 *                 example: Perera
 *               nicNumber:
 *                 type: string
 *                 example: 199012345678
 *               licenseNumber:
 *                 type: string
 *                 example: B1234567
 *               phone:
 *                 type: string
 *                 example: 0771234567
 *               district:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *     responses:
 *       201:
 *         description: Driver created
 *       409:
 *         description: NIC or license number already exists
 */
router.post('/', authorize('superadmin', 'provincial_admin', 'district_officer'), createDriver);

/**
 * @swagger
 * /api/drivers/{id}:
 *   put:
 *     summary: Update a driver
 *     tags: [Drivers]
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               nicNumber:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               phone:
 *                 type: string
 *               district:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *     responses:
 *       200:
 *         description: Driver updated
 *       404:
 *         description: Driver not found
 *       409:
 *         description: NIC or license conflict
 */
router.put('/:id', authorize('superadmin', 'provincial_admin', 'district_officer'), updateDriver);

/**
 * @swagger
 * /api/drivers/{id}:
 *   delete:
 *     summary: Delete a driver
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Driver deleted
 *       400:
 *         description: Cannot delete, linked to a vehicle
 *       404:
 *         description: Driver not found
 */
router.delete('/:id', authorize('superadmin', 'provincial_admin'), deleteDriver);

module.exports = router;
