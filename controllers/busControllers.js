const Bus = require("../models/Bus");

// 🚌 GET /api/buses?from=X&to=Y&date=Z
// controllers/busController.js
exports.getBuses = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    if (from && to && date) {
      const dateOnly = new Date(date + "T00:00:00");
      const startOfDay = new Date(dateOnly.setHours(0, 0, 0, 0));
      const endOfDay = new Date(dateOnly.setHours(23, 59, 59, 999));

      const filteredBuses = await Bus.find({
        stops: {
          $all: [
            { $elemMatch: { name: new RegExp(`^${from}$`, "i") } },
            { $elemMatch: { name: new RegExp(`^${to}$`, "i") } },
          ],
        },
        startDateTime: { $gte: startOfDay, $lte: endOfDay },
      });

      // Optional: Filter by order of stops (from before to)
      const orderedBuses = filteredBuses.filter((bus) => {
        const fromIndex = bus.stops.findIndex(
          (s) => s.name.toLowerCase() === from.toLowerCase()
        );
        const toIndex = bus.stops.findIndex(
          (s) => s.name.toLowerCase() === to.toLowerCase()
        );
        return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
      });

      return res.status(200).json(orderedBuses);
    }

    // Return all buses if no filter
    const allBuses = await Bus.find();
    return res.status(200).json(allBuses);
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


//  Add new bus route with automatic fareFromStart
exports.createBus = async (req, res, next) => {
  try {
    const { stopNames, startDateTime, endDateTime, seatsAvailable , isActive} = req.body;

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
      isActive,
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

    const farePerSegment = bus.farePerSegment || 100;

    // If fareFromStart is missing or 0, calculate it
    const updatedStops = bus.stops.map((stop, index) => {
      return {
        ...stop.toObject(), // convert to plain object
        fareFromStart: stop.fareFromStart ?? index * farePerSegment,
      };
    });

    // Return updated stops with fare
    const updatedBus = {
      ...bus.toObject(),
      stops: updatedStops,
    };

    res.status(200).json(updatedBus);
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
exports.enableBus = async (req, res, next) => {
  const updated = await Bus.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
  res.status(200).json({ message: "Bus enabled", updated });
};
