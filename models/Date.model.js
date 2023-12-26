const { mongoose, Schema, model } = require("mongoose");

const dateSchema = new Schema (
  {
    date: {
      type: Date,
      required: true
    },
    hour: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Date", dateSchema)