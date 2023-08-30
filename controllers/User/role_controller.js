const Role = require("../../models/Role");
const catchAsyncFunc = require("../../middlewares/catchAsyncFunc");

const helper = require("../../helper/helper");

exports.getRoles = catchAsyncFunc(async (req, res, next) => {
  const result = await Role.find({ status: 1 });
  helper.sendSuccess(res, { Role: result }, req, "Success");
});
exports.userRoles = catchAsyncFunc(async (req, res, next) => {
  const { userId } = req.query;
  const result = await Role.find({ status: 1, user: userId });
  helper.sendSuccess(res, { Role: result }, req, "Success");
});

exports.addRole = catchAsyncFunc(async (req, res, next) => {
  const { userId, role_name, role_permissions } = req.body;
  const RoleData = {
    user: userId,
    name: role_name,
    permissions: role_permissions,
  };
  const result = await Role.create(RoleData);
  helper.sendSuccess(res, { Role: result }, req, "Success");
});

exports.updateRole = catchAsyncFunc(async (req, res, next) => {
  const { userId, role_name, role_permissions } = req.body;
  const RoleData = {
    user: userId,
    name: role_name,
    permissions: role_permissions,
  };
  const result = await Role.findOneAndUpdate({ user: userId }, RoleData, {
    new: true,
    runValidators: true,
    userFindANdModify: false,
  });
  helper.sendSuccess(res, { Role: result }, req, "Success");
});

exports.blockRole = catchAsyncFunc(async (req, res, next) => {
  // const RoleData = req.body;
  const { role_id } = req.query;
  const result = await Role.findByIdAndUpdate(
    role_id,
    { status: 0 },
    {
      new: true,
      runValidators: true,
      userFindANdModify: false,
    }
  );
  helper.sendSuccess(
    res,
    { msg: "Role blocked successfully." },
    req,
    "Success"
  );
});
exports.blockUserRole = catchAsyncFunc(async (req, res, next) => {
  // const RoleData = req.body;
  const { userId } = req.query;
  const result = await Role.findOneAndUpdate(
    { user: userId },
    { status: 0 },
    {
      new: true,
      runValidators: true,
      userFindANdModify: false,
    }
  );
  helper.sendSuccess(
    res,
    { msg: "Role blocked successfully." },
    req,
    "Success"
  );
});
exports.deleteRole = catchAsyncFunc(async (req, res, next) => {
  const { role_id } = req.query;
  const result = await Role.findByIdAndDelete(role_id);
  helper.sendSuccess(
    res,
    { msg: "Role deleted successfully." },
    req,
    "Success"
  );
});
