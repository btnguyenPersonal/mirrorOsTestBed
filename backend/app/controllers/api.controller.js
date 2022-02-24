const db = require("../models");
const Event = db.event;
const Password = db.password;
const User = db.user;
const bcrypt = require("bcrypt");
const utils = require("../config/utils.js");
require("dotenv").config();

const exec = require("await-exec");

const NUMBER_OF_PORTS = 7;

exports.restart = async (req, res) => {
  /*
    #swagger.tags = ['api']
    #swagger.description = 'Restarts the PoE for a specific port by calling a script on the backend.'
    #swagger.parameters['id'] = { 
      in: 'path',
      description: 'The port id to restart. Must be in the range [1,7].' ,
      type: 'integer'
    }
    #swagger.responses[200] = { description: 'Sent when the command was executed successfully.' }
    #swagger.responses[400] = { description: 'Sent when something is wrong with your request that is within frontend\'s control.' }
    #swagger.responses[500] = { description: 'Sent when something went wrong with the backend outside of frontend\'s control.' }
  */
  const id = req.params.id;
  if (id < 1 || id > NUMBER_OF_PORTS) {
    res.status(400).send({
      message: `The port id must be between 1-${NUMBER_OF_PORTS} inclusive.`,
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
  /*
    #swagger.tags = ['api']
    #swagger.description = 'Use this to login to the website.'
  
    #swagger.parameters['body'] = { 
      in: 'body',
      schema: {
        email: 'email@email.com',
        password: 'somePassword48$'
      },
      description: 'A json object containing the email and password of a user attempting to log in.'
    }
  
    #swagger.responses[200] = { 
      description: 'Sent when a user successfully logs in.' ,
      schema: {
        "message": "Successfully logged in.",
        "usedAdminPassword": false,
        "isNewUser": true,
        "user": {
          "isAdmin": false,
          "userId": 1,
          "email": "email@email.com",
          "updatedAt": "2022-02-24T02:26:42.581Z",
          "createdAt": "2022-02-24T02:26:42.581Z"
        }
      }
    }
  
    #swagger.responses[401] = { description: 'Sent when the password was incorrect.' }
    #swagger.responses[412] = { description: 'Sent when something is wrong with your request\'s json object.' }
  */
  if (!req.body.email) {
    res.status(412).send({
      message: 'Requires an email: "email": <string>',
    });
    return;
  }
  if (!req.body.password) {
    res.status(412).send({
      message: 'Requires a password: "password": <string>',
    });
    return;
  }

  let passwords = await Promise.all([
    Password.findOne({
      where: {
        isAdminPassword: 0
      },
      order: [
        ["createdAt", "DESC"]
      ],
    }),
    Password.findOne({
      where: {
        isAdminPassword: 1
      },
      order: [
        ["createdAt", "DESC"]
      ],
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
  let isNewUser = false;
  let foundUser = await User.findOne({
    where: {
      email: req.body.email
    },
  }).then((foundUser) => {
    return foundUser;
  });
  if (!foundUser) {
    isNewUser = true;
    foundUser = await User.create({
      email: req.body.email
    }).then((user) => {
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
      isNewUser: isNewUser,
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
      isNewUser: isNewUser,
      user: foundUser,
    });
  }
  return;
};