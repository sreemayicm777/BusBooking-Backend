module.exports = (schema, property = 'body') => {
  return (req, res, next) => {
    if (!schema || typeof schema.validate !== "function") {
      return res.status(500).json({ message: "Validation schema is invalid or not provided" });
    }

    const { error } = schema.validate(req[property]);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    next();
  };
};
