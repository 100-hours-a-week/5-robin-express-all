const path = require("path");
const __dpath = path.resolve();
const fileSystem = require('fs');
const { checkAuthrizedPost } = require('../models/postModel');
const { checkAuthrizedComment } = require('../models/commentModel');

async function authorizedPost(req, res, next) {
    let post_id = req.params.postId;
    if(!post_id) {
        post_id = req.body.post_id;
    }
    const user_id = req.session.userId;
    const check = await checkAuthrizedPost(post_id, user_id);
    if(!check && post_id > -1) {
        res.status(403).json({message: "Unauthorized"});
    } else {
        next();
    }
    
}

async function authorizedComment(req, res, next) {
    const comment_id = req.params.commentId;
    const user_id = req.session.userId;
    console.log(user_id);
    const check = await checkAuthrizedComment(comment_id, user_id);
    if(!check) {
        res.status(403).json({message: "Unauthorized"});
    } else {
        next();
    }
}

module.exports = {
    authorizedPost,
    authorizedComment,
};