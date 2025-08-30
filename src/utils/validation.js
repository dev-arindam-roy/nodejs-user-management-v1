const handleValidation = async (schema, data) => {
  try {
    const validatedData = await schema.validate(data, {
      abortEarly: false, // collect all errors
      stripUnknown: true, // remove unknown fields
    });

    return { valid: true, data: validatedData };
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Collect key-value errors
      const formattedErrors = {};
      error.inner.forEach((err) => {
        if (err.path && !formattedErrors[err.path]) {
          formattedErrors[err.path] = err.message;
        }
      });

      const validationError = new Error('payload data validation error');
      validationError.statusCode = 400;
      validationError.details = formattedErrors;
      throw validationError;

      /*
      return {
        valid: false,
        status: 400,
        message: 'Validation Failed',
        errors: formattedErrors,
      };
      */
    }

    throw error; // rethrow other errors
  }
};

module.exports = { handleValidation };
