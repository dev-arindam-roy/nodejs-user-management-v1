const AppError = require('../utils/AppError');

module.exports = (err, req, res, next) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
      errors: err.details || null,
    });
  }

  if (err.statusCode === 400) {
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err.message || 'Bad Request',
      errors: err.details || null,
    });
  }

  if (err.statusCode === 404) {
    return res.status(404).json({
      status: 'error',
      statusCode: 404,
      message: err.message || 'Not Found',
      errors: err.details || null,
    });
  }

  // fallback
  res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: err.message || 'Internal Server Error',
    errors: err.details || null,
  });
};
