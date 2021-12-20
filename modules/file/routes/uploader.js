const path = require("path");
const { FileAPI } = require("../../../storage/FileAPI");
const {file_schema} = require("../models");
const fs = require('fs');
const uuid = require("uuid");
const joi = require("@hapi/joi");
const mimes = require("mime-types");

const schema = joi.object({
    file_name: joi.string().required(),
    encrypted_aes_key: joi.string().required(),
    file_iv: joi.string().required(),
}).options({stripUnknown:true});

const route = async (req, res) => {
    const { _user, file, body } = req;
    console.log(body)
    const {file_name,encrypted_aes_key, file_iv} = body;
    if (!file)
        return res.status(422).send(`There are no files attached to the request.`);
    const { originalname: original_name, filename: name, mimetype: mime_type } = file;

    const folder_path = path.resolve(__dirname, `../../../temp_files`);
    
    // const file_path = path.resolve(absolute, name);
    // const resize_path = path.resolve(absolute, `${name}_resize`);
    const extension = mimes.extension(mime_type);
    const file_data = await FileAPI.Uploader({folder_path, file_name:file.filename, mime_type:file.mimetype});
    console.log(file_data);
    const uploaded = new file_schema({
        _id: uuid.v4(),
        user_id: _user._id,
        file_id: `${file_data.file_id}.${extension}`,
        file_name: file_name,
        file_size: file.size,
        file_mime: file.mimetype,
        file_iv: file_iv,
        encrypted_aes_key: encrypted_aes_key,
    });
    await uploaded.save();
    return res.send(uploaded);
}

module.exports = { schema, route };