const db = require("../models");
const Event = db.event;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
    if (!req.body.event_type_id) {
        res.status(400).send({
            message: "Requires an event type id."
        });
        return;
    }
    if (!req.body.user_id) {
        res.status(400).send({
            message: "Requires a user id."
        });
        return;
    }
    const event = {
        event_type_id: req.body.event_type_id,
        user_id: req.body.user_id
    };
    Event.create(event)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Event."
        });
    });
};

exports.findAll = (req, res) => {
    Event.findAll()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving events."
        });
    });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    Event.findByPk(id)
    .then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Event with id=${id}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Event with id=" + id
        });
    });
};