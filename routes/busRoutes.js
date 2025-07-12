const express = require("express");
const router = express.Router();
const busControllers = require("../controllers/busControllers");
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');


//public (for users)
router.get('/', busControllers.getAllBuses);
router.get('/:id', busControllers.getBusById);

//Admin-only routes
router.post('/', protect, adminOnly, busControllers.createBus);
router.put('/:id', protect, adminOnly, busControllers.updateBus);
router.delete('/', protect, adminOnly, busControllers.deleteBus);
router.put('/', protect, adminOnly, busControllers.disableBus);

module.exports =router;