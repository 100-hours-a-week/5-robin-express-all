const path = require("path");
const fileSystem = require('fs');
const { upload } = require('../controllers/fileStorage.js');
const { listPosts, getDetailPost, createPost, updatePost, delPost } = require('../models/postModel.js');
const __dpath = path.resolve();



async function getPosts(req, res) {
    try {
        const posts = await listPosts();
        res.status(200).json({data: posts});
    } catch(err) {
        res.status(500).json({ error : err.message});
    }
};

async function createPosts(req, res) {
    const { post_id, subject, content, userid, imgfilePath } = req.body;
    if(post_id > -1) {
        try {
            const result = await updatePost(subject, content, imgfilePath, post_id);
            res.status(201).json({data: result});
        } catch(err) {
            res.status(500).json({error: err.message});
        }
    } else {
        try {
            const result = await createPost(subject, content, imgfilePath, userid);
            res.status(201).json({data: result});
        } catch(err) {
            res.status(500).json({error: err.message});
        }
    }
}

async function deletePost(req, res) {
    try {
        const result = await delPost(req.params.postId);
        res.status(200).json({data: result});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

async function getView(req, res) {
    try {
        const posts = await getDetailPost(req.params.postId);
        res.status(200).json({data: posts});
    } catch(err) {
        res.status(500).json({ error : err.message});
    }
}


function uploadImgfile(req, res) {
    console.log(req);
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('File upload failed:', err);
            return res.status(500).json({ error: 'File upload failed.' });
        } else {
            console.log('File uploaded successfully:', req.file);
            const filePath = req.file.path;
            res.status(201).json({
                message: filePath
            });
        }
    });
}


module.exports = {
    getPosts,
    createPosts,
    uploadImgfile,
    getView,
    deletePost
};
