const { mongoose, model, Schema } = require("mongoose");

const memberSchema = new Schema(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    availability: String,
    availabilities: [{
      type: Schema.Types.ObjectId,
      ref: "Availability"
    }]
  },
  {
    timestamps: true
  }
);

module.exports = model("Member", memberSchema);