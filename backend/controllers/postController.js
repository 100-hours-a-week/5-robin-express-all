const path = require("path");
const fileSystem = require('fs');
const { upload } = require('../controllers/fileStorage.js');

const __dpath = path.resolve();



function getPosts(req, res) {
    
    fileSystem.readFile(__dpath + '/models/post.json', 'utf8', (err, data) => {
        if (err) {
            console.log('error post.json read', err);
            return;
        }
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    });
};

function createPosts(req, res) {
    const postFile = fileSystem.readFileSync(__dpath + '/models/post.json', 'utf8');
    let posts = JSON.parse(postFile);
    const post = posts;
    const subject = req.body.subject;
    const content = req.body.content;
    const userid = req.body.userid;
    const nickname = req.body.nickname;
    const imgfilePath = req.body.imgfilePath;
    const profilePath = req.body.profilePath;
    //게시물수정
    const edit_id = req.body.edit_id;

    console.log(subject);
    console.log(imgfilePath);
    console.log(profilePath);
    console.log(edit_id);
    if (edit_id > -1) {
        const editpost = [];
        for (let i = 0; i < post.length; i++) {
            if (post[i].post_id == edit_id) {
                const postData = {
                    post_id: edit_id,
                    post_title: subject,
                    post_content: content,
                    file_id: 1,
                    user_id: userid,
                    nickname: nickname,
                    created_at: new Date(),
                    like: post[i].like,
                    comment_count: post[i].comment_count,
                    hits: post[i].hits,
                    file_path: imgfilePath,
                    profile_image_path: profilePath
                };
                //FIXME: 수정 파일등록 안할시 이미지 사라지는 오류
                console.log(postData);
                editpost.push(postData);
            } else {
                editpost.push(post[i]);
            }
        }
        console.log(editpost);
        const newPost = JSON.stringify(editpost);
        fileSystem.writeFileSync(__dpath + '/models/post.json', newPost, 'utf8');
        res.redirect('http://localhost:3000/posts');
    } else {
        let postId = 0;
        if(post.length > 0) {
            postId = parseInt(post[post.length - 1].post_id) + 1;
        }

        const postData = {
            post_id: postId,
            post_title: subject,
            post_content: content,
            file_id: 1,
            user_id: userid,
            nickname: nickname,
            created_at: new Date(),
            like: 0,
            comment_count: 0,
            hits: 0,
            file_path: imgfilePath,
            profile_image_path: profilePath
        };
        post.push(postData);
        const newPost = JSON.stringify(post);
        fileSystem.writeFileSync(__dpath + '/models/post.json', newPost, 'utf8');
        res.redirect('http://localhost:3000/posts');
    }
}

function getView(req, res) {
    const postId = req.params.postId;
    const postFile = fileSystem.readFileSync(__dpath + '/models/post.json', 'utf8');
    let posts = JSON.parse(postFile);
    const post = posts;
    const editpost = [];
    for (let i = 0; i < post.length; i++) {
        if (post[i].post_id == postId) {
            const postData = {
                post_id: post[i].post_id,
                post_title: post[i].post_title,
                post_content: post[i].post_content,
                file_id: 1,
                user_id: post[i].user_id,
                nickname: post[i].nickname,
                created_at: post[i].created_at,
                like: post[i].like,
                comment_count: post[i].comment_count,
                hits: post[i].hits+1,
                file_path: post[i].file_path,
                profile_image_path: post[i].profile_image_path
            };
            editpost.push(postData);
        } else {
            editpost.push(post[i]);
        }
    }
    const newPost = JSON.stringify(editpost);
    fileSystem.writeFileSync(__dpath + '/models/post.json', newPost, 'utf8');

    fileSystem.readFile(__dpath + '/models/post.json', 'utf8', (err, data) => {
        if (err) {
            console.log('error post.json read', err);
            return;
        }
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    });
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
            console.log(filePath);
            res.json({
                message: filePath
            })
        }
    });
}

function deletePost(req, res) {
    const postFile = fileSystem.readFileSync(__dpath + '/models/post.json', 'utf8');
    let posts = JSON.parse(postFile);
    const post = posts;
    const post_id = req.params.postId;
    const editpost = [];
        for (let i = 0; i < post.length; i++) {
            if (post[i].post_id == post_id) {
                console.log(post_id+"게시물 삭제");
            } else {
                editpost.push(post[i]);
            }
        }
        console.log(editpost);
        const newPost = JSON.stringify(editpost);
        fileSystem.writeFileSync(__dpath + '/models/post.json', newPost, 'utf8');
        res.status(200).json({message: "delete_post_success"});
}

module.exports = {
    getPosts,
    createPosts,
    uploadImgfile,
    getView,
    deletePost
};
