const express = require("express");
const {Validation, Auth} = require("../../../middlewares");
const login = require("./login");
const signup = require("./signup");
const file_list = require("./file_list");

const router = express.Router();

router.post("/auth/login", express.json(), Validation(login.schema), login.route);
router.post("/auth/signup", express.json(), Validation(signup.schema), signup.route);

router.get("/user/file/list", Auth(), Validation(file_list.schema), file_list.route);
module.exports = { user_routes: router };