const {user_schema} = require("../models");
const joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../../../env");

const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
}).options({stripUnknown:true});

const route = async(req, res) => {
    const { body } = req;
    const { email, password } = body;
    
    const user = await user_schema.findOne({email});
    if(!user)
        return res.status(404).send([{type:"email", message:"User not found"}]);

    const compare = await bcrypt.compare(password, user.password)
    if(compare == false)
        return res.status(401).send([{type:"password", message:"Password not correct"}]);

    let access_token = jwt.sign({_id:user._id}, env("JWT_SECRET","dev"));
    return res.send({user, access_token});
}

module.exports = {schema, route};