module.exports = (app) => {
  const api = require("../controllers/api.controller.js");
  var router = require("express").Router();
  router.post("/api/login", api.login);
  router.post("/api/reboot/:id", api.rebootPort);
  router.post("/api/useComputer/", api.useComputer);
  router.post("/api/releaseComputer/", api.releaseComputer);
  app.use("", router);
};
