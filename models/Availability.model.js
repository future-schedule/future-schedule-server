const {mongoose, Schema, model } = require("mongoose");

const availabilitySchema = new Schema (
  {
    availability: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Availability", availabilitySchema)
