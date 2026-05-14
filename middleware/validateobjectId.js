const mongoose = require("mongoose");

function validateObjectId(req, res, next) {
  const { id } = req.params;

  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return res.status(400).json({ message: "Invalid Id" });
  }

  next();
}

module.exports = validateObjectId;
