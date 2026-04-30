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

router.get('/', getAllDrivers);
router.get('/:id', getDriverById);
router.post('/', authorize('superadmin', 'provincial_admin', 'district_officer'), createDriver);
router.put('/:id', authorize('superadmin', 'provincial_admin', 'district_officer'), updateDriver);
router.delete('/:id', authorize('superadmin', 'provincial_admin'), deleteDriver);

module.exports = router;