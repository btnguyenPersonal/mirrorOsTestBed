const db = require("../models");
const Event = db.event;
const Password = db.password;
const User = db.user;
const bcrypt = require("bcrypt");
const utils = require("../config/utils.js");
require("dotenv").config();

const exec = require("await-exec");

exports.restart = async (req, res) => {
  const id = req.params.id;
  if (id < 1 || id > 7) {
    res.status(400).send({
      message: "The port id must be between 1-7 inclusive.",
    });
    return;
  }
  //This code will eventually be moved into a "runCommand" function.
  let command = ` ./reboot.sh ${id}`;
  if (process.env.OS.includes("Windows")) {
    command = "cd"; //Windows can't run our command without Windows Subsystem for Linux (WSL) and I can't install it lol.
  }
  return await exec(command)
    .then((r) => {
      if (!r.stderr) {
        res.status(200).send({
          message: "Command executed successfully.",
        });
      } else {
        res.status(500).send({
          message: r.stderr,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
      });
    });
};

exports.login = async (req, res) => {
  if (!req.body.email) {
    res.status(412).send({
      message: 'Requires an email: "email": <string>',
    });
  }
  if (!req.body.password) {
    res.status(412).send({
      message: 'Requires a password: "password": <string>',
    });
  }

  let passwords = await Promise.all([
    Password.findOne({
      where: { isAdminPassword: 0 },
      order: [["createdAt", "DESC"]],
    }),
    Password.findOne({
      where: { isAdminPassword: 1 },
      order: [["createdAt", "DESC"]],
    }),
  ]).then((modelReturn) => {
    return modelReturn.flat();
  });
  const isMatch = await bcrypt.compare(req.body.password, passwords[0].dataValues.password);
  const isMatchAdmin = await bcrypt.compare(req.body.password, passwords[1].dataValues.password);

  if (!(isMatchAdmin || isMatch)) {
    res.status(401).send({
      message: "Not the password.",
    });
    return;
  }
  let foundUser = await User.findOne({
    where: { email: req.body.email },
  }).then((foundUser) => {
    return foundUser;
  });
  if (!foundUser) {
    foundUser = await User.create({ email: req.body.email }).then((user) => {
      return user;
    });
  }
  if (isMatchAdmin) {
    //If user is not an admin but used the admin password, then we should update their admin status.
    if (!foundUser.isAdmin) {
      foundUser.isAdmin = 1;
      await foundUser.save();
    }
    await Event.create({
      eventTypeId: utils.ADMIN_LOGIN_EVENT_ID,
      userId: foundUser.dataValues.userId,
    });
    res.status(200).send({
      message: "Admin successfully logged in.",
      usedAdminPassword: true,
      user: foundUser,
    });
  } else {
    await Event.create({
      eventTypeId: utils.LOGIN_EVENT_ID,
      userId: foundUser.dataValues.userId,
    });
    res.status(200).send({
      message: "Successfully logged in.",
      usedAdminPassword: false,
      user: foundUser,
    });
  }
  return;
};
