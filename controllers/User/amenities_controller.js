const Amenity = require("../../models/Amenities");
const catchAsyncFunc = require("../../middlewares/catchAsyncFunc");
const helper = require("../../helper/helper");

exports.getAllAmenity = catchAsyncFunc(async (req, res, next) => {
  const result = await Amenity.find({ status: 1 });
  return helper.sendSuccess(res, result, req, "Success");
});
exports.addAmenity = catchAsyncFunc(async (req, res, next) => {
  const { name, description, category } = req.body;
  const AmenityData = {
    name: name,
    description: description,
    category: category,
  };
  const result = await Amenity.create(AmenityData);
  return helper.sendSuccess(res, result, req, "Success");
});
exports.updateAmenity = catchAsyncFunc(async (req, res, next) => {
  const { amenity_id } = req.query;
  const { name, description, category } = req.body;
  const AmenityData = {
    name: name,
    description: description,
    category: category,
  };

  const result = await Amenity.findByIdAndUpdate(amenity_id, AmenityData, {
    new: true,
    runValidators: true,
    userFindANdModify: false,
  });
  return helper.sendSuccess(
    res,
    { msg: "Amenity updated successfully." },
    req,
    "Success"
  );
});

exports.deleteAmenity = catchAsyncFunc(async (req, res, next) => {
  const { amenity_id } = req.query;
  await Amenity.findByIdAndDelete(amenity_id);
  return helper.sendSuccess(
    res,
    { msg: "Amenity deleted successfully." },
    req,
    "Success"
  );
});
