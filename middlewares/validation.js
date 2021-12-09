const validation = (scheme) => {
    return (req, res, next) => {
        let params = req.method == "POST" ? req.body : req.query;
        const isValid = scheme.validate(params, { abortEarly: false });
        if (isValid.error) {
            const errors = [];
            for(let i =0; i<isValid.error.details.length; i++){
                const {message, context} = isValid.error.details[i]
                errors.push({type:context.key, message});
            }
            console.log({errors})
            return res.status(422).send(errors);
        }

        if (req.method == "POST")
            req.body = isValid.value;

        if (req.method == "GET")
            req.query = isValid.value;

        next();
    }
}

module.exports = validation;