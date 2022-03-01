module.exports = app => {
    const api = require("../controllers/api.controller.js");
    var router = require("express").Router();
    router.post("/api/login", api.login);
    router.post("/api/restart/:id", api.restart);
    app.use("", router);
};