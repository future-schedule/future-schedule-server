const router = require("express").Router();
const { mongoose } = require("mongoose");
const MemberModel = require("../models/Member.model");
const EventModel = require("../models/Event.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { response } = require("express");

router.post("/events/:eventId/members", isAuthenticated, (req, res, next) => {
  const {eventId} = req.params;

  EventModel.findById(eventId)
    .then(event => {
      const addNewMember = {
        member: req.body.member
      };

      MemberModel.create(addNewMember)
        .then(newMember => {
          EventModel.findByIdAndUpdate(eventId, {$push: {members: newMember._id}}, {returnDocument: "after"})
            .populate({ path: "members", select: "-member.password", populate: { path: "member", select: "-password" } }) 
            .then(result => {
              res.json(result);
              console.log(result)
            })
            .catch(e => console.log("failed to push a new member", e));
        })
        .catch(e => {
          console.log("failed to create a new member")
          res.status(500).json({
            message: "error to create a new member",
            erro: e
          })
        })
      
    })
    .catch(e => {
      console.log("failed to add a new member")
      res.status(500).json({
        message: "error to add a new member",
        error: e
      })
    })
});

// The below freeze codes are to display the members list in case I want to display them

router.get("/members", isAuthenticated, (req, res, next) => {
  MemberModel.find()
    .populate({path: "member", select: "-password"})
    .then(memberList => res.json(memberList))
    .catch(e => {
      console.log("failed to fetch the members")
      res.status(500).json({
        message: "error to get the list of member",
        error: e
      });
    });
});


router.get("/members/:memberId", isAuthenticated, (req, res, next) => {
  const {memberId} = req.params;

  MemberModel.findById(memberId)
    .populate({path: "member", select: "-password"})
    .populate({ path: "availabilities", select: "-password", populate: { path: "availability", select: "-password" } })
    .then(specificMember => res.json(specificMember))
    .catch(e => {
      console.log("failed to fetch the members")
      res.status(500).json({
        message: "error to get the list of member",
        error: e
      });
    });
});


router.put("/members/:memberId", isAuthenticated, (req, res, next) => {
  const { memberId } = req.params;

  MemberModel.findByIdAndUpdate(memberId, { availability }, { new: true })
    .then(newAvailability => res.json(newAvailability))
    .catch(e => {
      console.log("Failed to update availability", e);
      res.status(500).json({
        message: "Error updating availability",
        error: e
      });
    });
});

router.delete("/members/:memberId", isAuthenticated, (req, res, next) => {
  const { memberId } = req.params;

  MemberModel.findByIdAndDelete(memberId)
    .then(response => res.json("removing the member was successfull", response))
    .catch(e => {
      console.log("failed to delete its event")
      res.status(500).json({
        message: "failed to romove its event",
        error: e
      });
    });
});


module.exports = router;

