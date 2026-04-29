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

router.get('/', getAllProvinces);
router.get('/:id', getProvinceById);
router.get('/:id/districts', getDistrictsByProvince);
router.post('/', authorize('superadmin'), createProvince);
router.put('/:id', authorize('superadmin'), updateProvince);
router.delete('/:id', authorize('superadmin'), deleteProvince);

module.exports = router;