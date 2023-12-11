const { mongoose, Schema, model } = require("mongoose");

const eventSchema = new Schema (
  {
    title: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    hour: {
      type: String,
      required: true
    },
    ownerEvent: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: "Member"
    }]
  },
  {
    timestamps: true
  }
);

module.exports = model("Event", eventSchema);
