const joi = require("@hapi/joi");
const { FileAPI } = require("../../../storage/FileAPI");
const {file_schema} = require("../models");
const schema = joi.object({
    file_id: joi.string().required(),
}).options({stripUnknown:true});

const route = async(req, res) => {
    const { query, _user } = req;
    const {file_id} = query;
    const user_file = await file_schema.findOne({user_id:_user._id, _id:file_id});
    console.log({user_id:_user._id, file_id});
    if(!user_file)
        return res.status(404).send(`file_not_found`);
    const file_url = await FileAPI.Downloader({key:user_file.file_id, response_type:user_file.file_mime, expires_min:120})
    return res.send(file_url);
}

module.exports = {schema, route};