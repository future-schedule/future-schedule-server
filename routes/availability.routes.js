const router = require("express").Router();
const { mongoose } = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const AvailabilityModel = require("../models/Availability.model");
const MemberModel = require("../models/Member.model");

router.post("/members/:memberId/availabilities", isAuthenticated, (req, res, next) => {
  const {memberId} = req.params;

  MemberModel.findById(memberId)
    .then(specificMember => {

      const addNewAvailability = {
        availability: req.body.availability
      };

      AvailabilityModel.create(addNewAvailability)
        .then(newAvailability => {
          MemberModel.findByIdAndUpdate(memberId, {$push: {availabilities: newAvailability._id}}, {returnDocument: "after"})
            .populate({ path: "availabilities", select: "-password", populate: { path: "availability", select: "-password" } }) 
            .then(result => {
              res.json(result);
              console.log(result)
            })
            .catch(e => console.log("failed to push a new availability", e));
        })
        .catch(e => {
          console.log("failed to create a new availability")
          res.status(500).json({
            message: "error to create a new availability",
            erro: e
          })
        })
      
    })
    .catch(e => {
      console.log("failed to add a new availability")
      res.status(500).json({
        message: "error to add a new availability",
        error: e
      })
    })
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