const Joi = require ('joi');


const updateEmailValidation = (req, res, next) => {
    const schema = Joi.object({
        newEmail: Joi.string().email().required(),
        otp: Joi.string().required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: "Bad request", error });
    }

    next();
};

module.exports = {updateEmailValidation}