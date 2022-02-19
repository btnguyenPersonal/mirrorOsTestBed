const { user } = require("../models");
const db = require("../models");
const Password = db.password;
const User = db.user;
console.log(Password);

function isBodyValid(req, res) {
  if (!req.body.password) {
    res.status(400).send({
      message: "Requires a password.",
    });
    return false;
  }
  if (!req.body.auth_email) {
    res.status(400).send({
      message: "Requires an email.",
    });
    return false;
  }
  return true;
}

exports.create = (req, res) => {
  if (!isBodyValid(req, res)) return;
  User.findOne({ where: { email: req.body.auth_email } }).then((data) => {
    //If a user exists with the email we are looking for.
    if (data) {
      if (data.dataValues.is_admin) {
        const password = {
          password: req.body.password,
        };
        Password.create(password)
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the Password.",
            });
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
        message:
          err.message || "Some error occurred while retrieving event types.",
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
