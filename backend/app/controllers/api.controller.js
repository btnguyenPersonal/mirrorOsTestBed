const db = require("../models");
const Event = db.event;

const password = "password";

exports.login = (req, res) => {
    if (!req.body.email) {
        res.status(400).send({
            message: "Requires an email."
        });
        return;
    }
    if (!req.body.password) {
        res.status(400).send({
            message: "Requires a password."
        });
        return;
    }
    if(req.body.password == password) {
        const event = {
            "event_type_id": 1,
            "user_id": 1
        }
        Event.create(event)
        .then(data => {
            res.status(200).send({
                message: "Success."
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the Event."
            });
        });
    } else {
        res.status(400).send({
            message: "Not the password."
        });
    }
}