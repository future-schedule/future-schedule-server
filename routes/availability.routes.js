const router = require("express").Router();
const { mongoose } = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const AvailabilityModel = require("../models/Availability.model");
const MemberModel = require("../models/Member.model");
const EventModel = require("../models/Event.model");
const DateModel = require("../models/Date.model");

router.post("/members/:memberId/availabilities", isAuthenticated, (req, res, next) => {
  const { memberId } = req.params;

  // Create a new availability
  AvailabilityModel.create({ availability: req.body.availability })
      .then(newAvailability => {
          console.log("New Availability Created:", newAvailability);

          // Push the new availability to the member
          MemberModel.findByIdAndUpdate(
              memberId,
              { $push: { availabilities: newAvailability._id } },
              { new: true } // Return the updated document
          )
              .populate({ path: "availabilities", select: "-password", populate: { path: "availability", select: "-password" } })
              .then(updatedMember => {
                  console.log("Updated Member:", updatedMember);

                  // Push the new availability to the date
                  const dateId = req.body.dateId; // You should pass the dateId in your request body
                  DateModel.findByIdAndUpdate(
                      dateId,
                      { $push: { availabilities: newAvailability._id } },
                      { new: true } // Return the updated document
                  )
                      .populate({ path: "availabilities", select: "-password", populate: { path: "availability", select: "-password" } })
                      .then(updatedDate => {
                          console.log("Updated Date:", updatedDate);

                          res.json({ member: updatedMember, date: updatedDate });
                      })
                      .catch(dateError => {
                          console.log("Failed to update date with new availability", dateError);
                          res.status(500).json({
                              message: "Error updating date with new availability",
                              error: dateError
                          });
                      });
              })
              .catch(memberError => {
                  console.log("Failed to update member with new availability", memberError);
                  res.status(500).json({
                      message: "Error updating member with new availability",
                      error: memberError
                  });
              });
      })
      .catch(e => {
          console.log("Failed to add a new availability", e);
          res.status(500).json({
              message: "Error adding a new availability",
              error: e
          });
      });
});

router.get("/availabilities", isAuthenticated, (req, res, next) => {

  AvailabilityModel.find()
    .then(availabilities => res.json(availabilities))
    .catch(e => {
      res.status(500).json({
        message: "failed to display the list of availabilities",
        error: e
      });
    });
});

router.get("/availabilities/:availabilityId", isAuthenticated, (req, res, next) => {
  const {availabilityId} = req.params;

  AvailabilityModel.findById(availabilityId)
    .then(specificAvailability => res.json(specificAvailability))
    .catch(e => {
      console.log("failed to get the specific availability", e)
      res.status(500).json({
        message: "failed to get the specific availability",
        error: e
      });
    });
});

router.put("/availabilities/:availabilityId", isAuthenticated, (req, res, next) => {
  const {availabilityId} = req.params;
  const {availability} = req.body;

  AvailabilityModel.findByIdAndUpdate(availabilityId, {availability}, {new: true})
    .then(newAvailability => res.json(newAvailability))
    .catch(e => {
      console.log("failed to update the availability")
      res.status(500).json({
        message: "failed to update the new availability",
        error: e
      });
    });
});

router.delete("/availabilities/:availabilityId", isAuthenticated, (req, res, next) => {
  const {availabilityId} = req.params;

  AvailabilityModel.findByIdAndDelete(availabilityId)
    .then(deleteAvailability => res.json("removing the availability was successfull", deleteAvailability))
    .catch(e => {
      console.log("failed to delete the availability", e)
      res.status(500).json({
        message: "failed to delete the availability",
        error: e
      });
    });
});

module.exports = router;