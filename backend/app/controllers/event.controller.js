const db = require("..");
const Event = db.event;
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

exports.findAll = (req, res) => {
  // #swagger.tags = ['event']
  Event.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving events.",
      });
    });
};

exports.findOne = (req, res) => {
  // #swagger.tags = ['event']
  const id = req.params.id;
  Event.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
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
