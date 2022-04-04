const db = require("..");
const Event = db.event;
const EventType = db.eventType;
const User = db.user;
const utils = require("../config/utils.js");
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
  // #swagger.tags = ['event']

  if (
    !utils.isBodyValid(req, res, {
      eventTypeId: "integer",
      userId: "integer",
    })
  ) {
    return;
  }
  const event = {
    eventTypeId: req.body.eventTypeId,
    userId: req.body.userId,
  };
  Event.create(event)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Event.",
      });
    });
};

exports.findAll = async (req, res) => {
  // #swagger.tags = ['event']
  Event.findAll()
    .then(async (data) => {
      for(var eventIndex in data) {
        theEvent = data[eventIndex];
        theEventType = await EventType.findByPk(theEvent.dataValues.eventTypeId);
        data[eventIndex].dataValues.eventType = theEventType;
        theUser = await User.findByPk(theEvent.dataValues.userId);
        data[eventIndex].dataValues.user = theUser;
      }
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events.",
      });
    });
};

exports.findOne = async (req, res) => {
  // #swagger.tags = ['event']
  const id = req.params.id;
  Event.findByPk(id)
    .then(async (theEvent) => {
      if (theEvent) {
        theEventType = await EventType.findByPk(theEvent.dataValues.eventTypeId);
        theEvent.dataValues.eventType = theEventType;
        theUser = await User.findByPk(theEvent.dataValues.userId);
        theEvent.dataValues.user = theUser;
        res.send(theEvent);
      } else {
        res.status(500).send({
          message: `Cannot find Event with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Event with id=" + id,
      });
    });
};
