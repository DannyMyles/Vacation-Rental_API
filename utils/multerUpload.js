const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('images', 10);


module.exports=upload;