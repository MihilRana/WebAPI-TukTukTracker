const express = require('express');
const router = express.Router();
const {
    getAllDistricts,
    getDistrictById,
    createDistrict,
    updateDistrict,
    deleteDistrict
} = require('../controllers/districtController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Districts
 *   description: District management endpoints
 */

/**
 * @swagger
 * /api/districts:
 *   get:
 *     summary: Get all districts
 *     tags: [Districts]
 *     parameters:
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: Filter by province ID
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: List of districts
 */
router.get('/', getAllDistricts);

/**
 * @swagger
 * /api/districts/{id}:
 *   get:
 *     summary: Get a district by ID
 *     tags: [Districts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: District data
 *       404:
 *         description: District not found
 */
router.get('/:id', getDistrictById);

/**
 * @swagger
 * /api/districts:
 *   post:
 *     summary: Create a new district (superadmin or provincial admin)
 *     tags: [Districts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - province
 *             properties:
 *               name:
 *                 type: string
 *                 example: Colombo
 *               code:
 *                 type: string
 *                 example: CMB
 *               province:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       201:
 *         description: District created
 *       409:
 *         description: District code already exists
 */
router.post('/', authorize('superadmin', 'provincial_admin'), createDistrict);

/**
 * @swagger
 * /api/districts/{id}:
 *   put:
 *     summary: Update a district
 *     tags: [Districts]
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
 *               code:
 *                 type: string
 *               province:
 *                 type: string
 *     responses:
 *       200:
 *         description: District updated
 *       404:
 *         description: District not found
 */
router.put('/:id', authorize('superadmin', 'provincial_admin'), updateDistrict);

/**
 * @swagger
 * /api/districts/{id}:
 *   delete:
 *     summary: Delete a district (superadmin only)
 *     tags: [Districts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: District deleted
 *       400:
 *         description: Cannot delete, has linked stations or vehicles
 */
router.delete('/:id', authorize('superadmin'), deleteDistrict);

module.exports = router;