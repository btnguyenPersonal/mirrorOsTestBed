const db = require("../models");
const EventType = db.event_types;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
    if (!req.body.event_type) {
        res.status(400).send({
            message: "Requires an event type."
        });
        return;
    }
    const event_type = {
        event_type: req.body.event_type,
    };
    EventType.create(event_type)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Event Type."
        });
    });
};

exports.findAll = (req, res) => {
    EventType.findAll()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving event types."
        });
    });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    EventType.findByPk(id)
    .then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Event Type with id=${id}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Event Type with id=" + id
        });
    });
};