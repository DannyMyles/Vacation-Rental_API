const express = require("express");
const router = express.Router();

const upload = require("../utils/multerUpload");
const { uploadMedia } = require("../controllers/upload_media_controller");

router.post("/", upload, uploadMedia);

module.exports = router;