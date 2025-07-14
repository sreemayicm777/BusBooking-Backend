const Bus = require("../models/Bus");

//  Get all active buses
exports.getBuses = async (req, res, next) => {
  try {
    const { from, to, date } = req.query;
    let buses;

    if (from && to && date) {
      const travelDate = new Date(date);
      const nextDay = new Date(travelDate);
      nextDay.setDate(nextDay.getDate() + 1);

      buses = await Bus.find({
        stops: {
          $all: [{ $elemMatch: { name: from } }, { $elemMatch: { name: to } }],
        },
        startDateTime: { $get: travelDate, $lt: nextDay },
        isActive: true,
      });

      //validate stop order
      buses = buses.filter((bus) => {
        const fromIndex = bus.stops.findIndex((s) => s.name === from);
        const toIndex = bus.stops.findIndex((s) => s.name === to);
        return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
      });
    } else {
      //No filetr , Return all buses
      const buses = await Bus.find({ isActive: true });
    }
    res.status(200).json(buses);
  } catch (err) {
    next(err);
  }
};

//  Add new bus route with automatic fareFromStart
exports.createBus = async (req, res, next) => {
  try {
    const { stopNames, startDateTime, endDateTime, seatsAvailable } = req.body;

    if (!stopNames || !Array.isArray(stopNames) || stopNames.length < 2) {
      res.status(400);
      throw new Error("At least two stops are required.");
    }

    const FARE_PER_SEGMENT = 100;
    const stops = stopNames.map((name, index) => ({
      name,
      fareFromStart: index * FARE_PER_SEGMENT,
    }));

    const bus = await Bus.create({
      from: stopNames[0],
      to: stopNames[stopNames.length - 1],
      stops,
      startDateTime,
      endDateTime,
      seatsAvailable,
    });

    res.status(201).json(bus);
  } catch (err) {
    next(err);
  }
};

//  Get a bus by ID
exports.getBusById = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      res.status(404);
      throw new Error("Bus Not Found!");
    }
    res.status(200).json(bus);
  } catch (err) {
    next(err);
  }
};

//  Update a bus route
exports.updateBus = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      res.status(404);
      throw new Error("Bus not found");
    }

    const updated = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

//  Delete a bus route
exports.deleteBus = async (req, res, next) => {
  try {
    const deletedBus = await Bus.findByIdAndDelete(req.params.id);

    if (!deletedBus) {
      res.status(404);
      throw new Error("Bus not found");
    }

    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (err) {
    next(err);
  }
};

//  Disable (deactivate) a bus
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

