const express = require("express");
const router = express.Router();
const bookingControllers = require("../controllers/bookingController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require('../middlewares/roleMiddleware');
const validate =  require("../middlewares/validate");
const { bookBusSchema } = require("../validations/bookingValidation");

router.post('/', protect, validate(bookBusSchema), bookingControllers.bookBus);
router.get('/my-bookings', protect, bookingControllers.getMyBookings);
router.put('/cancel/:id', protect, bookingControllers.cancelBooking);

// Admin-only route

router.get('/all-bookings', protect, adminOnly, bookingControllers.getAllBookings);


module.exports = router;