const { user_schema } = require("../models");
const joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const {file_schema} = require("../../file/models")

const schema = joi.object({
}).options({ stripUnknown: true });

const route = async (req, res) => {
    const { body } = req;
    const all_files = await file_schema.find({user_id:req._user._id}).countDocuments();

    res.send({totalDoc: all_files});
}

module.exports = { schema, route };