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

router.get('/', getAllVehicles);
router.get('/:id', getVehicleById);
router.post('/', authorize('superadmin', 'provincial_admin', 'district_officer'), createVehicle);
router.put('/:id', authorize('superadmin', 'provincial_admin', 'district_officer'), updateVehicle);
router.delete('/:id', authorize('superadmin', 'provincial_admin'), deleteVehicle);

module.exports = router;