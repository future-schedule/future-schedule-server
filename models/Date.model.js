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
    },
    availabilities: [{
      type: Schema.Types.ObjectId,
      ref: "Availability"
    }]
  },
  {
    timestamps: true
  }
);

// Populate the "availabilities" property when querying for a date
dateSchema.pre('findOne', function (next) {
  this.populate('availabilities');
  next();
});

// Populate the "availabilities" property when querying for multiple dates
dateSchema.pre('find', function (next) {
  this.populate('availabilities');
  next();
});

module.exports = model("Date", dateSchema)