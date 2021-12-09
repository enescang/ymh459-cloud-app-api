const joi = require("@hapi/joi");
const { FileAPI } = require("../../../storage/FileAPI");

const schema = joi.object({
    file_id: joi.string().required(),
    type: joi.string().valid("image","video").required(),
}).options({stripUnknown:true});

const route = async(req, res) => {
    const { query } = req;
    const {file_id, type} = query;
    const file_url = await FileAPI.Downloader({key:file_id, response_type:type, expires_min:120})
    return res.send(file_url);
}

module.exports = {schema, route};