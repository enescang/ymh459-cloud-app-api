const { user_schema } = require("../models");
const joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    username: joi.string().default(null),
}).options({ stripUnknown: true });

const route = async (req, res) => {
    const { body } = req;
    const { email, password, role, displayName } = body;
    const is_exists = await user_schema.findOne({ email });
    if (is_exists)
        return res.status(409).send(`email_exists`);

    const hashed = await bcrypt.hash(password, 10);
    const _id = uuid.v4();

    const user = new user_schema({
        _id,
        email,
        username:body.username,
        password: hashed,
    });
    await user.save();
    res.send(user);
}

module.exports = { schema, route };