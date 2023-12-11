const { mongoose, model, Schema } = require("mongoose");

const memberSchema = new Schema(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    availability: String
  },
  {
    timestamps: true
  }
);

module.exports = model("Member", memberSchema);