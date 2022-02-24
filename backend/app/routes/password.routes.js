module.exports = (app) => {
  const password = require("../controllers/password.controller.js");
  var router = require("express").Router();
  router.post("/", password.create);
  router.get("/:id", password.findOne);
  router.get("/", password.findAll);
  app.use("/api/password", router);
};
