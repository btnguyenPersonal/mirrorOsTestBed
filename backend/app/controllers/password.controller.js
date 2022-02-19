const { user } = require("../models");
const db = require("../models");
const bcrypt = require("bcrypt");
const Password = db.password;
const User = db.user;
console.log(Password);

function isBodyValid(req, res) {
  if (!req.body.password) {
    res.status(400).send({
      message: 'Requires a password: "password": <string>',
    });
    return false;
  }
  if (!req.body.auth_email) {
    res.status(400).send({
      message: 'Requires an email: "email": <string>',
    });
    return false;
  }
  if (req.body.change_admin_password != 0 && req.body.change_admin_password != 1) {
    res.status(400).send({
      message: 'Requires which password you would like to change: "change_admin_password": <boolean>',
    });
    return false;
  }
  return true;
}

exports.create = async (req, res) => {
  if (!isBodyValid(req, res)) return;
  User.findOne({ where: { email: req.body.auth_email } }).then(async (data) => {
    if (data) {
      if (data.dataValues.is_admin) {
        hashed_password = await bcrypt.hash(req.body.password, 10);
        let sqlPassword = await Password.findOne({
          where: { is_admin_password: req.body.change_admin_password },
          order: [["createdAt", "DESC"]],
        });
        sqlPassword.password = hashed_password;
        await sqlPassword.save();
        res.status(200).send({
          message: (req.body.change_admin_password ? "Admin password" : "Password") + " changed successfully.",
        });
      } else {
        res.status(500).send({
          message: "Not an admin. Don't even try...",
        });
      }
    } else {
      res.status(500).send({
        message: "Couldn't find email: " + req.body.auth_email,
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
        res.status(404).send({
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
