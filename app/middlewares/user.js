const { ApiError } = require('../helpers/errorHandler');

const userMiddleware = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        throw new ApiError('unauthorized', { statusCode: 401 });
    }
};

module.exports = userMiddleware;
