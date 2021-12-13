const express = require("express");
const multer = require("multer");
const {Validation, Auth} = require("../../../middlewares");;
const downloader = require("./downloader");
const uploader = require("./uploader");

const router = express.Router();

const Upload = multer({dest:"./temp_files"});

router.get("/file/download", Auth(), Validation(downloader.schema), downloader.route);
router.post("/file/upload", Upload.single("file"), Auth(),  Validation(uploader.schema), uploader.route);

module.exports = { file_routes: router };