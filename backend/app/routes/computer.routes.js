module.exports = (app) => {
  const computer = require("../controllers/computer.controller.js");
  var router = require("express").Router();
  router.post("/api/computer/", computer.create);
  router.get("/api/computer/", computer.findAll);
  router.get("/api/computer/:id", computer.findOne);
  router.delete("/api/computerDestroy/", computer.destroy);
  app.use("", router);
};
