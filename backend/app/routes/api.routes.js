module.exports = app => {
    const api = require("../controllers/api.controller.js");
    var router = require("express").Router();
    router.post("/login", api.login);
    app.use('/api', router);
};