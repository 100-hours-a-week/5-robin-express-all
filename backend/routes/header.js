const express = require("express");
const headerController = require("../controllers/headerController.js");
const router = express.Router();

router.get('/', headerController.validheader);


module.exports = router;
