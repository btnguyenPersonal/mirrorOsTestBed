const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.email) {
    res.status(412).send({
      message: 'Requires an email: "email": <string>',
    });
    return;
  }
  const user = {
    email: req.body.email,
  };
  if (req.body.is_admin) {
    user.is_admin = req.body.is_admin;
  }
  User.create(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

exports.findAll = (req, res) => {
  User.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  User.findByPk()
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(500).send({
          message: `Cannot find User with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};
