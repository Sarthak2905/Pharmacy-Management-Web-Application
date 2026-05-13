const mongoose = require('mongoose');

function toObjectId(value, fieldName = 'id') {
  if (!value || !mongoose.isValidObjectId(value)) {
    const error = new Error(`Invalid ${fieldName}`);
    error.statusCode = 400;
    throw error;
  }

  return new mongoose.Types.ObjectId(value);
}

module.exports = { toObjectId };
