const {user_schema, verify_schema} = require("../models");
const joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../../../env");

const schema = joi.object({
    email: joi.string().email().required(),
    code: joi.number().required(),
}).options({stripUnknown:true});

const route = async(req, res) => {
    const { body } = req;
    const { email, code } = body;
    
    const user = await user_schema.findOne({email});
    if(!user)
        return res.status(404).send(`user_not_found`);
    
    const find_code = await verify_schema.findOne({user_id: user._id, is_valid:true}).sort({created_at: -1});
    if(!find_code){
        console.log("REQUEST:: /auth/verify otp_code_not_found")
        return res.status(401).send(`otp_code_not_found`);
    }

    if(find_code.code !== code){
        console.log("REQUEST:: /auth/verify otp_code_wrong")
        return res.status(401).send(`otp_code_wrong`);
    }

    if(find_code.sent_at + (2 * 60 * 1000) < Date.now()){
        console.log("REQUEST:: /auth/verify otp_expired")
        return res.status(422).send(`otp_expired`);    
    }

    console.log(find_code.sent_at + (2 * 60 * 1000) < Date.now())
    let access_token = jwt.sign({_id:user._id}, env("JWT_SECRET","dev"));

    find_code.set({is_valid:false});
    await find_code.save();
    console.log("SUCCESS");
    return res.send({user, access_token});
}

module.exports = {schema, route};