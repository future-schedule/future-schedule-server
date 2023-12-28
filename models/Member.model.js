const { mongoose, model, Schema } = require("mongoose");

const memberSchema = new Schema(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: "User"
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

// Populate the "availabilities" property when querying for a member
memberSchema.pre('findOne', function (next) {
  this.populate('availabilities');
  next();
});

// Populate the "availabilities" property when querying for multiple members
memberSchema.pre('find', function (next) {
  this.populate('availabilities');
  next();
});

module.exports = model("Member", memberSchema);