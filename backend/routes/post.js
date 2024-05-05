const express = require("express");
const postController = require("../controllers/postController.js");
const commentController = require("../controllers/commentController.js");
const router = express.Router();

router.get('/', postController.getPosts);
router.get('/:postId', postController.getView);

//게시글 쓰기 수정 둘다 post로 받음
router.post('/', postController.createPosts);

router.post('/upload/attach-file', postController.uploadImgfile);
router.delete('/:postId', postController.deletePost);

router.get('/:postId/comments', commentController.getComments);
router.post('/:postId/comments', commentController.createComment);
router.patch('/:postId/comments/:commentId', commentController.createComment);
router.delete('/:postId/comments/:commentId', commentController.deleteComment);

module.exports = router;
