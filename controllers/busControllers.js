const Bus = require("../models/Bus");

// @desc Get all active buses
exports.getAllBuses = async (req, res, next) => {
  try {
    const buses = await Bus.find({ isActive: true });
    res.status(200).json(buses);
  } catch (err) {
    next(err);
  }
};

// @desc Add new bus route
exports.createBus = async (req, res, next) => {
  try {
    const bus = await Bus.create(req.body);
    console.log("Bus details are", bus);
    res.status(201).json(bus);
  } catch (err) {
    next(err);
  }
};

// @desc Get a bus by ID
exports.getBusById = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      res.status(404);
      throw new Error('Bus Not Found!');
    }
    res.status(200).json(bus);
  } catch (err) {
    next(err);
  }
};

// @desc Update a bus route
exports.updateBus = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      res.status(404);
      throw new Error("Bus not found");
    }

    const updated = await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc Delete a bus route
exports.deleteBus = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      res.status(404);
      throw new Error("Bus not found");
    }

    await Bus.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Bus deleted" });
  } catch (err) {
    next(err);
  }
};

// @desc Disable (deactivate) a bus
exports.disableBus = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      res.status(404);
      throw new Error("Bus not found");
    }

    const updated = await Bus.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    res.status(200).json({ message: "Bus disabled successfully", updated });
  } catch (err) {
    next(err);
  }
};
