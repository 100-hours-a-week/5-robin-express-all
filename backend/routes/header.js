const express = require("express");
const headerController = require("../controllers/headerController.js");
const { isAuthenticated } = require('../controllers/authController.js');
const router = express.Router();


router.get('/', isAuthenticated, headerController.validheader);


module.exports = router;
