const express = require("express");
const imageController = require("../controllers/imageController.js");
const router = express.Router();

router.get('/:postId', imageController.imageView);

module.exports = router;