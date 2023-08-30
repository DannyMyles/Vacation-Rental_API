const helper = require("../../helper/helper");
const catchAsyncFunc = require("../../middlewares/catchAsyncFunc");
const PartnerHosting = require("../../models/PartnerHosting");
const User = require("../../models/User");
const { sendNotification } = require("../../utils/sendNotification");

exports.addPartnerHosting = catchAsyncFunc(async (req, res, next) => {
  const requiredFields = [
    "guests",
    "gender",
    "pets",
    "smoking",
    "placeType",
    "interestsUserHave",
    "interestsUserLookingFor",
    "latitude",
    "longitude",
    "startDate",
    "endDate",
    "address",
    "price",
    "images",
    "description",
    "title",
    "priceTimeline",
  ];
  const partnerHostingBody = req.body;
  if (
    !requiredFields.every((field) =>
      Object.keys(partnerHostingBody).includes(field)
    )
  ) {
    return helper.sendError(
      400,
      res,
      {
        error: `Required fields are missing: ${requiredFields.filter(
          (field) => !Object.keys(partnerHostingBody).includes(field)
        )}`,
      },
      req
    );
  }
  console.log(req.user);
  if (
    new Date(partnerHostingBody.startDate) >
    new Date(partnerHostingBody.endDate)
  ) {
    return helper.sendError(
      400,
      res,
      {
        error: "Start date should be less than end date",
      },
      req
    );
  }
  if (new Date(partnerHostingBody.startDate) < new Date()) {
    return helper.sendError(
      400,
      res,
      {
        error: "Start date should be greater than current date",
      },
      req
    );
  }
  if (new Date(partnerHostingBody.endDate) < new Date()) {
    return helper.sendError(
      400,
      res,
      {
        error: "End date should be greater than current date",
      },
      req
    );
  }
  if (Number(partnerHostingBody.price) < 0) {
    return helper.sendError(
      400,
      res,
      { error: "Price should be greater than 0" },
      req
    );
  }
  if (partnerHostingBody.interestsUserHave.length < 1) {
    return helper.sendError(
      400,
      res,
      {
        error: "Please select atleast one interest",
      },
      req
    );
  }

  const user = await User.findById(req.user);
  if (!user)
    return helper.sendError(400, res, { error: "User not found" }, req);

  if (user.partnerHostings.length > 10) {
    return helper.sendError(
      400,
      res,
      {
        error: "You can add only 10 partnerHostings",
      },
      req
    );
  }

  const partnerHosting = await new PartnerHosting({
    ...partnerHostingBody,
    user: req.user,
    images: partnerHostingBody.images,
    price: Number(partnerHostingBody.price),
    latitdue: Number(partnerHostingBody.latitude),
    longitude: Number(partnerHostingBody.longitude),
    startDate: new Date(partnerHostingBody.startDate),
    endDate: new Date(partnerHostingBody.endDate),
  });

  await partnerHosting.save();

  user.partnerHostings.push(partnerHosting._id);

  await user.save();

  const result = await sendNotification(
    "New Partner Hosting Added",
    "New Partner Hosting Added in your listing",
    {
      images: partnerHostingBody.images[0],
    },
    req.user
  );

  if (result.success) {
    return helper.sendSuccess(
      res,
      {
        msg: "Add your partnerHosting successfully",
      },
      req
    );
  }
  return helper.sendError(
    400,
    res,
    {
      error: "Something went wrong",
    },
    req
  );
});

exports.deletePartnerHosting = catchAsyncFunc(async (req, res, next) => {
  const { hosting_id } = req.query;
  if (!hosting_id)
    return helper.sendError(
      res,
      { error: "partnerHosting id is required" },
      req
    );
  if (!req.user)
    return helper.sendError(400, res, { error: "User id is required" }, req);

  const partnerHosting = await PartnerHosting.findById(hosting_id);
  if (!partnerHosting)
    return helper.sendError(
      400,
      res,
      { error: "partnerHosting not found" },
      req
    );

  const user = await User.findById(req.user);
  if (!user)
    return helper.sendError(400, res, { error: "User not found" }, req);

  user.partnerHostings = user.partnerHostings.filter(
    (hosting) => hosting.toString() !== hosting_id
  );
  await user.save();

  await PartnerHosting.findByIdAndDelete(hosting_id);

  return helper.sendSuccess(
    res,
    {
      msg: "PartnerHosting deleted successfully.",
    },
    req
  );
});

exports.updatePartnerHosting = catchAsyncFunc(async (req, res, next) => {
  const { hosting_id } = req.query;
  if (!hosting_id)
    return helper.sendError(
      400,
      res,
      { error: "PartnerHosting id is required" },
      req
    );

  const partnerHosting = await PartnerHosting.findById(hosting_id);

  if (!partnerHosting)
    return helper.sendError(
      400,
      res,
      { error: "PartnerHosting not found" },
      req
    );

  const user = await User.findById(req.user);

  if (!user)
    return helper.sendError(400, res, { error: "User not found" }, req);

  if (!user.partnerHostings.includes(hosting_id))
    return helper.sendError(
      400,
      res,
      {
        error: "You are not allowed to update this PartnerHosting",
      },
      req
    );

  const findUserWithPartnerHoting = await PartnerHosting.findOne({
    user: req.user,
  });
  if (!findUserWithPartnerHoting) {
    return helper.sendError(
      400,
      res,

      {
        error: "You are not allowed to update this PartnerHosting",
      },
      req
    );
  }

  const updatedPartnerHostingBody = { ...req.body, images: req.body.images };
  if ("latitude" in req.body) {
    updatedPartnerHostingBody.latitude = Number(req.body.latitude);
  }
  if ("longitude" in req.body) {
    updatedPartnerHostingBody.longitude = Number(req.body.longitude);
  }
  if ("price" in req.body) {
    updatedPartnerHostingBody.price = Number(req.body.price);
  }
  if ("startDate" in req.body) {
    updatedPartnerHostingBody.startDate = new Date(req.body.startDate);
  }
  if ("endDate" in req.body) {
    updatedPartnerHostingBody.endDate = new Date(req.body.endDate);
  }

  await PartnerHosting.findByIdAndUpdate(
    hosting_id,
    {
      $set: updatedPartnerHostingBody,
    },
    {
      new: true,
    }
  );

  return helper.sendSuccess(
    res,
    {
      msg: "ParnterHosting updated successfully.",
    },
    req
  );
});

exports.getAllPartnerHosting = catchAsyncFunc(async (req, res, next) => {
  const partnerHosting = await PartnerHosting.find({});

  return helper.sendSuccess(res, { partnerHosting }, req);
});

exports.getPartnerHosting = catchAsyncFunc(async (req, res, next) => {
  const { hosting_id } = req.query;
  if (!hosting_id)
    return helper.sendError(
      400,
      res,
      { error: "PartnerHosting id is required" },
      req
    );

  const partnerHosting = await PartnerHosting.findById(hosting_id);
  if (!partnerHosting)
    return helper.sendError(
      400,
      res,
      { error: "PartnerHosting not found" },
      req
    );

  return helper.sendSuccess(res, { partnerHosting }, req);
});
