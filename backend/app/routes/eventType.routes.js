module.exports = (app) => {
  const event_types = require("../controllers/eventType.controller.js");
  var router = require("express").Router();
  router.post("/api/event_types/", event_types.create);
  router.get("/api/event_types/", event_types.findAll);
  router.get("/api/event_types/:id", event_types.findOne);
  app.use("", router);
};