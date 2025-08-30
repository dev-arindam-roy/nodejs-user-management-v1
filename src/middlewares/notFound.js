// middlewares/notFound.js
const AppError = require("../utils/AppError");

const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

module.exports = notFound;
