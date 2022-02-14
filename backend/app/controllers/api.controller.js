const db = require("../models");
const Event = db.event;
//const { spawn } = require("child_process");
const exec = require('await-exec')


const password = "password";


async function restartPort(portId) {
    //console.log("portId: " + portId);
    return await exec(`./reboot.sh ${portId}`).then((r) => {
        if(r.stderr) {
            return false;
        } else {
            return true;
        }
    });
}

exports.restart = async (req, res) => {
    const id = req.params.id;
    if (id < 1 || id > 7) {
        res.status(400).send({
            message: "id must be between 1-7 inclusive."
        });
        return;
    }
    if(await restartPort(id)) {
        res.status(400).send({
            message: "Success."
        });
    } else {
        res.status(400).send({
            message: "Failed."
        });
    }
}

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