const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validateRegistration } = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and profile management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 minimum: 3
 *                 example: officer_colombo
 *               password:
 *                 type: string
 *                 minimum: 6
 *                 example: secure123
 *               role:
 *                 type: string
 *                 enum: [superadmin, provincial_admin, district_officer, station_officer, operator]
 *                 example: district_officer
 *               assignedProvince:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               assignedDistrict:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *               assignedStation:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439013
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Username already exists
 *       400:
 *         description: Validation failed
 */
router.post('/register', validateRegistration, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and receive JWT token
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Account deactivated
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Not authenticated
 */
router.get('/profile', authenticate, getProfile);

module.exports = router;