const express = require("express");
const { getAbout, createAbout } = require("../controllers/about_controller");
const upload = require("../utils/multerUpload");
const router = express.Router();

/**
* @swagger
* /v1/user/get-about:
*   get:
*     tags:
*       - About
*     description: Get About
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Get About
*       400:
*         description: Error
* /v1/user/create-about:
*   post:
*     tags:
*       - About
*     description: Create About
*     produces:
*       - application/json
*     parameters:
*       - tttle: about
*         description: about
*         in: formData
*         required: true
*         type: string
*       - title: image
*         description: image
*         in: formData
*         required: true
*         type: file
*     responses:
*       200:
*         description: Create About
*       400:
*         description: Error
    
*

*/

router.get("/get-about", getAbout);
router.post("/create-about", upload, createAbout);

module.exports = router;
