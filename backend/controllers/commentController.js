const path = require("path");
const fileSystem = require('fs');
const { upload } = require('../controllers/fileStorage.js');
const { listComments, createComments, editComments, delComments } = require('../models/commentModel.js');
const __dpath = path.resolve();



async function getComments(req, res) {
    try {
        const comments = await listComments(req.params.postId);
        res.status(200).json({data: comments});
    } catch(err) {
        res.status(500).json({ error : err.message});
    }
};

async function createComment(req, res) {
    const { post_id, content } = req.body;
    const user_id = req.session.userId;
    try {
        const comments = await createComments(req.session.userId, post_id, content);
        res.status(201).json({data: comments});
    } catch(err) {
        res.status(500).json({ error : err.message});
    }

}

async function editComment(req, res) {
    const { content } = req.body;
    const comment_id = req.params.commentId;
    try {
        const comments = await editComments(content, comment_id);
        res.status(200).json({data: comments});
    } catch(err) {
        res.status(500).json({ error : err.message});
    }
}

async function deleteComment(req, res) {
    const comment_id = req.params.commentId;
    const post_id = req.params.postId;
    try {
        const comments = await delComments(comment_id, post_id);
        res.status(200).json({data: comments});
    } catch(err) {
        res.status(500).json({ error : err.message});
    }
}

module.exports = {
    getComments,
    createComment,
    deleteComment,
    editComment,
};
