const path = require("path");
const { FileAPI } = require("../../../storage/FileAPI");
const {file_schema} = require("../models");
const fs = require('fs');
const uuid = require("uuid");
// const sharp = require('sharp');

const route = async (req, res) => {
    const { _user, file } = req;
    if (!file)
        return res.status(422).send(`There are no files attached to the request.`);
    const { originalname: original_name, filename: name, mimetype: mime_type } = file;
    
    const folder_path = path.resolve(__dirname, `../../../temp_files`);
    
    // const file_path = path.resolve(absolute, name);
    // const resize_path = path.resolve(absolute, `${name}_resize`);
    const file_data = await FileAPI.Uploader({folder_path, file_name:file.filename, mime_type:file.mimetype});
    console.log(file_data);
    const uploaded = new file_schema({
        _id: uuid.v4(),
        user_id: _user._id,
        file_id: file_data.file_id,
    });
    await uploaded.save();
    return res.send(uploaded);
}

module.exports = { route };