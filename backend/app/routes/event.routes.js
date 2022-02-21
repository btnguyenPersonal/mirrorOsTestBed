module.exports = (app) => {
  const event = require("../controllers/event.controller.js");
  var router = require("express").Router();
  router.post("/", event.create);
  router.get("/", event.findAll);
  router.get("/:id", event.findOne);
  app.use("/api/event", router);
};
