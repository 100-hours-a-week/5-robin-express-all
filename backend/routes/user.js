const express = require("express");
const userController = require("../controllers/userController.js");
const router = express.Router();

router.post('/login', userController.validAccount);
router.post('/signup', userController.signAccount);
router.post('/upload/profile-image', userController.uploadProfile);
router.post('/:userId', userController.editAccount);

router.patch('/:userId/password', userController.editPwd);
router.delete('/:userId', userController.delAccount);

module.exports = router;
