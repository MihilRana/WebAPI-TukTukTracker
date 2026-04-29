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

router.get('/', getAllDistricts);
router.get('/:id', getDistrictById);
router.post('/', authorize('superadmin', 'provincial_admin'), createDistrict);
router.put('/:id', authorize('superadmin', 'provincial_admin'), updateDistrict);
router.delete('/:id', authorize('superadmin'), deleteDistrict);

module.exports = router;