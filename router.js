const express = require("express");
const {user_routes} = require("./modules/user/routes");
const {file_routes} = require("./modules/file/routes")
const Router = express.Router();

Router.use(user_routes);
Router.use(file_routes);

module.exports = Router;