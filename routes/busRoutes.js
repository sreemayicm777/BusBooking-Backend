const express = require("express");
const router = express.Router();
const busControllers = require("../controllers/busControllers");
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');
const validate = require("../middlewares/validate");
const { createBusSchema, searchBusSchema, validateSearchQuery  } = require("../validations/busValidation");

//public (for users)
router.get('/', validateSearchQuery, busControllers.getBuses);  //api/buses?from=Kottayam&to=Bangalore&date=2025-07-20
router.get('/:id', busControllers.getBusById);

//Admin-only routes
router.post('/', protect, adminOnly, validate(createBusSchema), busControllers.createBus);
router.put('/:id', protect, adminOnly, busControllers.updateBus);
router.delete('/:id', protect, adminOnly, busControllers.deleteBus);
router.put('/disable/:id', protect, adminOnly, busControllers.disableBus);
router.put('/enable/:id', protect, adminOnly, busControllers.enableBus);


module.exports =router;