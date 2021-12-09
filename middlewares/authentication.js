const jwt = require("jsonwebtoken");
const {user_schema} = require("../modules/user/models");
const env = require("../env");

const AUTH = (role_types) => {
    return async(req, res, next) => {
        try {
            const { body, query } = req;
            let auth = req.header('Authorization');//my token
            if (!auth)
                return res.status(401).send(`not_logged_in`);
            auth = auth.split(" ")[1]; //Bearer:mytoken
            if (!auth)
                return res.status(401).send(`not_logged_in`);
            let { _id } = jwt.verify(auth, env("secret", "dev"));//decoded
           
            // console.log(_id);
            if (!_id)
                return res.status(401).send(`not_logged_in`);
    
            // console.log(JSON.stringify(filter))
            const _user = await user_schema.findOne({_id});
            if (!_user)
                return res.status(401).send(`not_logged_in`);
            req._user = _user;
            return next();
        } catch (error) {
            console.log(error)
            return res.status(401).send(`jwt_malformed`);
        }
    }
}

module.exports = AUTH;