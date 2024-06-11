const express = require("express");
const postController = require("../controllers/postController.js");
const commentController = require("../controllers/commentController.js");
const isAuthenticated = require("../controllers/authController.js");
const isAuth = require("../controllers/isAuth.js");
const router = express.Router();




router.get('/', isAuthenticated.isAuthenticated , postController.getPosts);
router.get('/:postId', postController.getView);

//게시글 쓰기 수정 둘다 post로 받음
router.post('/', isAuth.authorizedPost ,postController.createPosts);

router.post('/upload/attach-file', postController.uploadImgfile);
router.delete('/:postId', isAuth.authorizedPost ,postController.deletePost);

router.get('/:postId/comments', commentController.getComments);
router.post('/:postId/comments', commentController.createComment);
router.patch('/:postId/comments/:commentId', isAuth.authorizedComment ,commentController.editComment);
router.delete('/:postId/comments/:commentId', isAuth.authorizedComment ,commentController.deleteComment);

module.exports = router;
