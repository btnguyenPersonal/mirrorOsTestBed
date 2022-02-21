module.exports = (app) => {
  const user = require("../controllers/user.controller.js");
  var router = require("express").Router();
  router.post("/", user.create);
  router.get("/", user.findAll);
  router.get("/:id", user.findOne);
  app.use("/api/user", router);
};
