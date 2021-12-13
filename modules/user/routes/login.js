const {user_schema, verify_schema} = require("../models");
const joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../../../env");
const uuid = require("uuid");
const nodemailer = require("nodemailer");

const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
}).options({stripUnknown:true});

const route = async(req, res) => {
    const { body } = req;
    const { email, password } = body;
    
    const user = await user_schema.findOne({email});
    if(!user)
        return res.status(404).send(`user_not_found`);

    const compare = await bcrypt.compare(password, user.password)
    if(compare == false)
        return res.status(401).send(`password_wrong`);

        const code = Math.random().toString(36).substring(2, 8);
        // const code = "999999";
        var transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: env("SMTP_USER_NAME"),
            pass: env("SMTP_USER_PASS"),
        }
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Friday Company - Verify Code", // Subject line
        text: `Hi. This is your OTP Code: ${code}`, // plain text body
    });
      
    const save_code = new verify_schema({_id: uuid.v4(), user_id: user._id, code: code, sent_at: Date.now(), is_valid: true});
    await save_code.save();
    // let access_token = jwt.sign({_id:user._id}, env("JWT_SECRET","dev"));
    return res.send('otp_code_sended');
    return res.send({user, access_token});
}

module.exports = {schema, route};