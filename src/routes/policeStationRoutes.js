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

router.get('/', getAllStations);
router.get('/:id', getStationById);
router.post('/', authorize('superadmin', 'provincial_admin'), createStation);
router.put('/:id', authorize('superadmin', 'provincial_admin'), updateStation);
router.delete('/:id', authorize('superadmin'), deleteStation);

module.exports = router;