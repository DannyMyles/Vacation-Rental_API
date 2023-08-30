module.exports = {
  sendError: function (error_code, res, text, req) {
    res.status(error_code).send({
      action: req.originalUrl,
      code: error_code,
      status: false,
      data: text,
      message: text,
    });
  },
  sendSuccess: function (res, text, req, message = "") {
    res.status(200).send({
      action: req.originalUrl,
      code: 200,
      status: true,
      data: text,
      message: message,
    });
  },
  validateEmail: function (email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return email.match(emailRegex);
   },
  validatePhone: (phone) => {

    return phone.match(/^(?:\+\d{1,3})?[1-9]\d{9}$/);
  },
};