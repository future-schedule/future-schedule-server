const { mongoose, Schema, model } = require("mongoose");

const eventSchema = new Schema (
  {
    title: {
      type: String,
      required: true
    },
    hour: {
      type: String
    },
    ownerEvent: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    dates: [{
      type: Schema.Types.ObjectId,
      ref: "Date"
    }],
    members: [{
      type: Schema.Types.ObjectId,
      ref: "Member"
    }],
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Event", eventSchema);
