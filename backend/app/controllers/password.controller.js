const db = require("../models");
const bcrypt = require("bcrypt");
const Password = db.password;
const User = db.user;
const Event = db.event;
const utils = require("../config/utils.js");

function isBodyValid(req, res) {
  if (!req.body.password) {
    res.status(412).send({
      message: 'Requires a password: "password": <string>',
    });
    return false;
  }
  if (!req.body.authEmail) {
    res.status(412).send({
      message: 'Requires an email: "authEmail": <string>',
    });
    return false;
  }
  if (req.body.changeAdminPassword != 0 && req.body.changeAdminPassword != 1) {
    res.status(412).send({
      message: 'Requires which password you would like to change: "changeAdminPassword": <boolean>',
    });
    return false;
  }
  return true;
}

exports.create = async (req, res) => {
  if (!isBodyValid(req, res)) return;
  User.findOne({ where: { email: req.body.authEmail } }).then(async (data) => {
    if (data) {
      if (data.dataValues.isAdmin) {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
        let sqlPassword = await Password.findOne({
          where: { isAdminPassword: req.body.changeAdminPassword },
          order: [["createdAt", "DESC"]],
        });
        sqlPassword.password = hashedPassword;
        await sqlPassword.save();
        await Event.create({
          eventTypeId: req.body.changeAdminPassword
            ? utils.CHANGED_ADMIN_PASSWORD_EVENT_ID
            : utils.CHANGED_PASSWORD_EVENT_ID,
          userId: data.dataValues.userId,
        });
        res.status(200).send({
          message: (req.body.changeAdminPassword ? "Admin password" : "Password") + " changed successfully.",
          password: sqlPassword,
        });
      } else {
        res.status(403).send({
          message: "Not an admin. Don't even try...",
        });
      }
    } else {
      res.status(401).send({
        message: "Couldn't find email: " + req.body.authEmail,
      });
    }
  });
};

exports.findAll = (req, res) => {
  Password.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving passwords.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Password.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(500).send({
          message: `Cannot find Password with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Password with id=" + id,
      });
    });
};
