module.exports = (app) => {
  const event_types = require("../controllers/eventType.controller.js");
  var router = require("express").Router();
  router.post("/", event_types.create);
  router.get("/", event_types.findAll);
  router.get("/:id", event_types.findOne);
  app.use("/api/event_types", router);
};
