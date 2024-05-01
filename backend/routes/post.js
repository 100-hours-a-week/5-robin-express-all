const express = require("express");
const postController = require("../controllers/postController.js");
const commentController = require("../controllers/commentController.js");
const router = express.Router();

router.get('/', postController.getPosts);
router.get('/:postId', postController.getView);
router.post('/', postController.createPosts);
router.post('/upload/attach-file', postController.uploadImgfile);

router.get('/:postId/comments', commentController.getComments);
router.post('/:postId/comments', commentController.createComment);
router.patch('/:postId/comments/:commentId', commentController.createComment);

module.exports = router;
