const debug = require('debug')('userController');
const validator = require('email-validator');
const bcrypt = require('bcrypt');

const { ApiError } = require('../helpers/errorHandler');

const { User } = require('../models');

const userController = {
    subscribe: async (req, res) => {
        debug('suscribe');
        const form = req.body;

        const user = await User.findOne({ where: { email: form.email.toLowerCase() } });
        if (!user) {
            if (validator.validate(form.email)) {
                if (form.password === form.passwordConfirm) {
                    const passwordHashed = await bcrypt.hash(form.password, 10);
                    const newUser = new User({
                        firstname: form.firstname,
                        lastname: form.lastname,
                        email: form.email.toLowerCase(),
                        password: passwordHashed,
                    });

                    await newUser.save();
                    return res.json('success');
                }
                throw new ApiError('the password and its confirmation are not identical', { statusCode: 400 });
            }
            throw new ApiError('email address is incorrect', { statusCode: 400 });
        }
        throw new ApiError('email already exists', { statusCode: 400 });
    },
};
module.exports = userController;
