const jwt = require("jsonwebtoken");
const helper = require("../helper/helper");

const catchAsyncFunc = (controller) => {
  return async (req, res, next) => {
    try {
      // Getting Authorization from headers
      const authHeader = req.get("Authorization");

      if (!authHeader) {
        return helper.sendError(403, res, { error: "Access Denied" }, req);
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return helper.sendError(403, res, { error: "Access Denied" }, req);
      }

      let decodedToken;
      try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken.user_id;
      } catch (err) {
        return helper.sendError(
          403,
          res,
          { error: "You are not authorized to perform this request" },
          req
        );
      }

      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = catchAsyncFunc;
