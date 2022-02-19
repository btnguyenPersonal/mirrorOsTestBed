const db = require("../models");
const Event = db.event;
const Password = db.password;
const User = db.user;
const bcrypt = require("bcrypt");
const utils = require("../config/utils.js");

const exec = require("await-exec");

async function restartPort(portId) {
  //console.log("portId: " + portId);
  return await exec(`./reboot.sh ${portId}`).then((r) => {
    if (r.stderr) {
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
      message: "id must be between 1-7 inclusive.",
    });
    return;
  }
  if (await restartPort(id)) {
    res.status(400).send({
      message: "Success.",
    });
  } else {
    res.status(400).send({
      message: "Failed.",
    });
  }
};

exports.login = async (req, res) => {
  if (!req.body.email) {
    res.status(400).send({
      message: "Requires an email.",
    });
    return;
  }
  if (!req.body.password) {
    res.status(400).send({
      message: "Requires a password.",
    });
    return;
  }

  let passwords = await Promise.all([
    Password.findOne({
      where: { is_admin_password: 0 },
      order: [["createdAt", "DESC"]],
    }),
    Password.findOne({
      where: { is_admin_password: 1 },
      order: [["createdAt", "DESC"]],
    }),
  ]).then((modelReturn) => {
    return modelReturn.flat();
  });
  const isMatch = await bcrypt.compare(req.body.password, passwords[0].dataValues.password);
  const isMatchAdmin = await bcrypt.compare(req.body.password, passwords[1].dataValues.password);

  if (!(isMatchAdmin || isMatch)) {
    res.status(500).send({
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
    if (!foundUser.is_admin) {
      foundUser.is_admin = 1;
      await foundUser.save();
    }
    await Event.create({
      event_type_id: utils.ADMIN_LOGIN_EVENT_ID,
      user_id: foundUser.dataValues.user_id,
    });
    res.status(200).send({
      message: "Admin successfully logged in.",
    });
  } else {
    await Event.create({
      event_type_id: utils.LOGIN_EVENT_ID,
      user_id: foundUser.dataValues.user_id,
    });
    res.status(200).send({
      message: "Successfully logged in.",
    });
  }
  return;
};
