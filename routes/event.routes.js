const router = require("express").Router();
const EventModel = require("../models/Event.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/events", isAuthenticated, (req, res, next) => {
  const {title, date, hour, password} = req.body;
  const newEvent = {
    title: title, date: date, hour: hour, 
    ownerEvent: req.payload._id, password: password
  };

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
    .populate({ path: "members", select: "name password", populate: { path: "member", select: "-password"} })
    .populate({path: "dates", select: "-password", populate: {path: "date", select: "-password"}})
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

// Add a new route for fetching event details without a password
router.get("/events/details/:eventId", isAuthenticated, (req, res, next) => {
  const { eventId } = req.params;

  EventModel.findById(eventId)
    .populate({
      path: "ownerEvent",
      select: "-password",
    })
    .populate({
      path: "members",
      select: "-password",
      populate: { path: "member", select: "-password" },
    })
    .populate({
      path: "dates",
      select: "-password",
      populate: { path: "date", select: "-password" },
    })
    .then((eventDetails) => {
      if (!eventDetails) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(eventDetails);
    })
    .catch((error) => {
      console.log("Failed to fetch event details", error);
      res.status(500).json({
        message: "Error fetching event details",
        error: error,
      });
    });
});

router.post("/events/:eventId", isAuthenticated, (req, res, next) => {
  const {eventId} = req.params;
  const {password} = req.body;
  
  EventModel.findById(eventId)
    .then((event) => {
      if(!event) {
        return res.status(404).json({message: "Event not found"})
      }

      if(password === event.password) {
        return EventModel.findById(eventId)
        .populate({path: "ownerEvent", select: "-password"})
        .populate({path: "members", select: "-password", populate: { path: "member", select: "-password"}})
        .populate({path: "dates", select: "-password", populate: {path: "date", select: "-password"}})
       } else {
        return Promise.reject({status: 401, message: "Incorrect password"})
      }
    })
    .then(eventDetails => {
      res.json(eventDetails)
    })
    .catch((error) => {
      console.log("Failed to verify password", error);
      const status = error.status || 500;
      res.status(status).json({
        message: error.message || "Error verifying password",
        error: error
      });
    });
});

router.put("/events/:eventId", isAuthenticated, (req, res, next) => {
  const {eventId} = req.params;
  const updateEventBody = {title: req.body.title, date: req.body.date, hour: req.body.hour};

  EventModel.findByIdAndUpdate(eventId, updateEventBody, {new: true})
    .then(eventUpdated => {res.json(eventUpdated)})
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

  EventModel.findByIdAndDelete(eventId)
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