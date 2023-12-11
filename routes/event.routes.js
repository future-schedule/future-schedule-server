const router = require("express").Router();
const EventModel = require("../models/Event.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/events", isAuthenticated, (req, res, next) => {
  const {title, date, hour} = req.body;
  const newEvent = {title: title, date: date, hour: hour, ownerEvent: req.payload._id};

  EventModel.create(newEvent)
    .then(response => res.json(response))
    .catch(e => {
      res.status(500).json({
        message: "failed to create a new event",
        error: e
      })
    })

});

router.get("/events", isAuthenticated, (req, res, next) => {

  EventModel.find()
    .populate({path: "ownerEvent", select: "-password"})
    .populate({ path: "members", select: "-password", populate: { path: "member", select: "-password" } })
    .then(eventList => {
      res.json(eventList);
    })
    .catch(e => {
      console.log("failed to display list of events");
      res.status(500).json({
        message: "error to find the list of events",
        error: e
      });
    });
});

router.get("/events/:eventId", isAuthenticated, (req, res, next) => {
  const {eventId} = req.params;

  EventModel.findById(eventId)
    .populate({path: "ownerEvent", select: "-password"})
    .populate({path: "members", select: "-password"})
    .then(eventDetails => res.json(eventDetails))
    .catch(e => {
      console.log("failed to display list of events");
      res.status(500).json({
        message: "error to find the list of events",
        error: e
      });
    })
});

router.put("/events/:eventId", isAuthenticated, (req, res, next) => {
  const {eventId} = req.params;
  const updateEventBody = {title: req.body.title, date: req.body.date};

  EventModel.findByIdAndUpdate(eventId, updateEventBody, {new: true})
    .then(eventUpdated => res.json(eventUpdated))
    .catch(e => {
      console.log("failed to update its event")
      res.status(500).json({
        message: "error updating its event",
        error: e
      });
    });

});

router.delete("/events/:eventId", isAuthenticated, (req, res, next) => {
  const {eventId} = req.params;

  EventModel.findByIdAndRemove(eventId)
    .then(response => res.json("removing the event was successfull"))
    .catch(e => {
      console.log("failed to delete its event")
      res.status(500).json({
        message: "failed to romove its event",
        error: e
      });
    });
});

module.exports = router;