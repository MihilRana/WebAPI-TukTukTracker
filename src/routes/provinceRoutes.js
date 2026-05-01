const express = require('express');
const router = express.Router();
const {
    getAllProvinces,
    getProvinceById,
    createProvince,
    updateProvince,
    deleteProvince,
    getDistrictsByProvince
} = require('../controllers/provinceController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Provinces
 *   description: Province management endpoints
 */

/**
 * @swagger
 * /api/provinces:
 *   get:
 *     summary: Get all provinces
 *     tags: [Provinces]
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g. name, code)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of all provinces
 */
router.get('/', getAllProvinces);

/**
 * @swagger
 * /api/provinces/{id}:
 *   get:
 *     summary: Get a province by ID
 *     tags: [Provinces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Province ID
 *     responses:
 *       200:
 *         description: Province data
 *       404:
 *         description: Province not found
 */
router.get('/:id', getProvinceById);

/**
 * @swagger
 * /api/provinces/{id}/districts:
 *   get:
 *     summary: Get all districts in a province
 *     tags: [Provinces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Province ID
 *     responses:
 *       200:
 *         description: List of districts in the province
 *       404:
 *         description: Province not found
 */
router.get('/:id/districts', getDistrictsByProvince);

/**
 * @swagger
 * /api/provinces:
 *   post:
 *     summary: Create a new province (superadmin only)
 *     tags: [Provinces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *                 example: Western
 *               code:
 *                 type: string
 *                 example: WP
 *     responses:
 *       201:
 *         description: Province created
 *       409:
 *         description: Province already exists
 *       403:
 *         description: Not authorized
 */
router.post('/', authorize('superadmin'), createProvince);

/**
 * @swagger
 * /api/provinces/{id}:
 *   put:
 *     summary: Update a province (superadmin only)
 *     tags: [Provinces]
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
 *     responses:
 *       200:
 *         description: Province updated
 *       404:
 *         description: Province not found
 */
router.put('/:id', authorize('superadmin'), updateProvince);

/**
 * @swagger
 * /api/provinces/{id}:
 *   delete:
 *     summary: Delete a province (superadmin only)
 *     tags: [Provinces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Province deleted
 *       400:
 *         description: Cannot delete, has linked districts
 *       404:
 *         description: Province not found
 */
router.delete('/:id', authorize('superadmin'), deleteProvince);

module.exports = router;
