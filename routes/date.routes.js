const router = require("express").Router();
const { mongoose } = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const DateModel = require("../models/Date.model");
const EventModel = require("../models/Event.model");

router.post("/events/:eventId/dates", isAuthenticated, (req, res, next) => {
  const {eventId} = req.params;

  EventModel.findById(eventId)
    .then(event => {
      const addNewDate = {
        date: req.body.date,
        hour: req.body.hour
      };
      
      DateModel.create(addNewDate)
        .then(newDate => {
          EventModel.findByIdAndUpdate(eventId, {$push: {dates: newDate._id}}, {returnDocument: "after"})
          .populate({path: "dates", select: "-password", populate: {path: "date", select: "-password"}})
          .then(result => {
            console.log(result)
            res.json(result)
          })
          .catch(e => console.log("failed to add new date", e));
        })
        .catch(e => {
          res.status(500).json({
            message: "failed to create a new date",
            error: e
          });
        });
        
    })
  
});

router.get("/dates/:dateId", isAuthenticated, (req, res, next) => {
  const {dateId} = req.params;

  DateModel.findById(dateId)
  .populate({path: "date", select: "-password"})
  .populate({ path: "availabilities", select: "-password", populate: { path: "availability", select: "-password" } })
  .then(specificDate => res.json(specificDate))
  .catch(e => {
    console.log("failed to fetch the specific date")
    res.status(500).json({
      message: "error to get the specific date",
      error: e
    });
  });
});

router.put("/dates/:dateId", isAuthenticated, (req, res, next) => {
  const {dateId} = req.params;
  const dateBody = {
    date: req.body.date,
    hour: req.body.hour
  };

  DateModel.findByIdAndUpdate(dateId, dateBody, {new: true})
  .populate({path: "date", select: "-password"})
  .populate({ path: "availabilities", select: "-password", populate: { path: "availability", select: "-password" } })
  .then(updateSpecificDate => res.json(updateSpecificDate))
  .catch(e => {
    console.log("failed to update the specific date")
    res.status(500).json({
      message: "error to update the specific date",
      error: e
    });
  });
});

router.delete("/dates/:dateId", isAuthenticated, (req, res, next) => {
  const {dateId} = req.params;

  DateModel.findByIdAndDelete(dateId)
  .then(() => res.json("removing the specific date was successfull"))
  .catch(e => {
    console.log("failed to remove the specific date")
    res.status(500).json({
      message: "error to remove the specific date",
      error: e
    });
  });
});


module.exports = router;
