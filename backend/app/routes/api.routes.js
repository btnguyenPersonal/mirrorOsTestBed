module.exports = (app) => {
  const api = require("../controllers/api.controller.js");
  var router = require("express").Router();
  router.post("/api/login", api.login);
  router.post("/api/restart/:id", api.restartPort);
  router.post("/api/useComputer/", api.useComputer);
  router.post("/api/releaseComputer/", api.releaseComputer);
  app.use("", router);
};
