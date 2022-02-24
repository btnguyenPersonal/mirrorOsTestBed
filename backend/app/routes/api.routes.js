module.exports = app => {
    const api = require("../controllers/api.controller.js");
    var router = require("express").Router();
    router.post("/login", api.login);
    router.post("/restart/:id", api.restart);
    app.use('/api', router);
};