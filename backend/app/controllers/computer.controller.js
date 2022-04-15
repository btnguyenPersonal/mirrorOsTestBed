const db = require("..");
const Computer = db.computer;
const Event = db.event;
const utils = require("../config/utils.js");
exports.create = (req, res) => {
  // #swagger.tags = ['computer']
  if (
    !utils.isBodyValid(req, res, {
      portId: "integer",
      model: "string",
      serialNumber: "string",
      userId: "integer",
    })
  ) {
    return;
  }
  const userId = req.body.userId;
  const computer = {
    portId: req.body.portId,
    model: req.body.model,
    serialNumber: req.body.serialNumber,
  };
  Computer.create(computer)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Computer.",
      });
    });
    Event.create({
      eventTypeId: utils.COMPUTER_CREATED_EVENT_ID,
      userId: userId,
    });
};

exports.findAll = (req, res) => {
  // #swagger.tags = ['computer']
  Computer.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving computers.",
      });
    });
};

exports.findOne = (req, res) => {
  // #swagger.tags = ['computer']
  const id = req.params.id;
  Computer.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(500).send({
          message: `Cannot find Computer with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Computer with id=" + id,
      });
    });
};

exports.destroy = (req,res) => {
  // #swagger.tags = ['computer']
  const computerId = req.body.computerId;
  const userId = req.body.userId;
  Computer.destroy({
    where: { computerId: computerId },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: `Computer deleted`,
      });
    } else {
      res.status(500).send({
        message: `Cannot find Computer with id=${computerId}.`,
      });
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: "Error deleting Computer with id=" + computerId,
    });
  });
  Event.create({
    eventTypeId: utils.COMPUTER_DELETED_EVENT_ID,
    userId: userId,
  });
}
